-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'trainer', 'support', 'trainee');

-- Create enum for platform type
CREATE TYPE public.platform_type AS ENUM ('e_tax', 'customs', 'e_sw');

-- Create enum for module type
CREATE TYPE public.module_type AS ENUM ('video', 'document', 'quiz', 'simulation', 'case_study');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES public.profiles(id),
  UNIQUE(user_id, role)
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  platform platform_type NOT NULL,
  thumbnail_url TEXT,
  duration_hours INTEGER,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create modules table
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  module_type module_type NOT NULL,
  order_index INTEGER NOT NULL,
  content_url TEXT,
  duration_minutes INTEGER,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  progress_percentage INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, module_id)
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  passing_score INTEGER DEFAULT 70,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_questions table
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice',
  options JSONB,
  correct_answer TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL
);

-- Create quiz_attempts table
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN DEFAULT false,
  attempt_number INTEGER NOT NULL,
  answers JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  certificate_url TEXT
);

-- Create training_sessions table
CREATE TABLE public.training_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  session_type TEXT DEFAULT 'virtual',
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  meeting_url TEXT,
  max_participants INTEGER,
  trainer_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create session_attendance table
CREATE TABLE public.session_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attended BOOLEAN DEFAULT false,
  attended_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(session_id, user_id)
);

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to check if user is admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('admin', 'super_admin')
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Anyone can view user roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Only admins can manage roles" ON public.user_roles FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for courses
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true OR public.is_admin(auth.uid()));
CREATE POLICY "Admins and trainers can create courses" ON public.courses FOR INSERT WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'super_admin') OR 
  public.has_role(auth.uid(), 'trainer')
);
CREATE POLICY "Admins and trainers can update courses" ON public.courses FOR UPDATE USING (
  public.is_admin(auth.uid()) OR 
  public.has_role(auth.uid(), 'trainer')
);
CREATE POLICY "Only admins can delete courses" ON public.courses FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for modules
CREATE POLICY "Anyone can view published modules" ON public.modules FOR SELECT USING (
  is_published = true OR public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'trainer')
);
CREATE POLICY "Admins and trainers can manage modules" ON public.modules FOR ALL USING (
  public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'trainer')
);

-- RLS Policies for user_progress
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (
  auth.uid() = user_id OR public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'trainer')
);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress records" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for quizzes
CREATE POLICY "Anyone can view quizzes" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Admins and trainers can manage quizzes" ON public.quizzes FOR ALL USING (
  public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'trainer')
);

-- RLS Policies for quiz_questions
CREATE POLICY "Anyone can view quiz questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Admins and trainers can manage questions" ON public.quiz_questions FOR ALL USING (
  public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'trainer')
);

-- RLS Policies for quiz_attempts
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts FOR SELECT USING (
  auth.uid() = user_id OR public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'trainer')
);
CREATE POLICY "Users can create own attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for certificates
CREATE POLICY "Users can view own certificates" ON public.certificates FOR SELECT USING (
  auth.uid() = user_id OR public.is_admin(auth.uid())
);
CREATE POLICY "Only system can issue certificates" ON public.certificates FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- RLS Policies for training_sessions
CREATE POLICY "Anyone can view training sessions" ON public.training_sessions FOR SELECT USING (true);
CREATE POLICY "Trainers and admins can manage sessions" ON public.training_sessions FOR ALL USING (
  public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'trainer')
);

-- RLS Policies for session_attendance
CREATE POLICY "Users can view own attendance" ON public.session_attendance FOR SELECT USING (
  auth.uid() = user_id OR public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'trainer')
);
CREATE POLICY "Users can register for sessions" ON public.session_attendance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own attendance" ON public.session_attendance FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for support_tickets
CREATE POLICY "Users can view own tickets" ON public.support_tickets FOR SELECT USING (
  auth.uid() = user_id OR 
  public.is_admin(auth.uid()) OR 
  public.has_role(auth.uid(), 'support')
);
CREATE POLICY "Users can create tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tickets" ON public.support_tickets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Support staff can update assigned tickets" ON public.support_tickets FOR UPDATE USING (
  auth.uid() = assigned_to OR 
  public.is_admin(auth.uid()) OR 
  public.has_role(auth.uid(), 'support')
);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_modules_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  
  -- Assign default trainee role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'trainee');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();