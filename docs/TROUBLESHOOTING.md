# Troubleshooting Guide

This document provides solutions to common issues you might encounter when running the LLM Engine.

## Common Issues and Solutions

### 1. Scraper Blocked

**Problem**: Scrapers are being blocked by government websites.

**Solutions**:
1. **Check robots.txt**: Ensure scrapers respect robots.txt rules
2. **Implement delays**: Add longer delays between requests
3. **Use proxies**: Configure proxy servers for scraping
4. **User-Agent rotation**: Rotate user-agent strings
5. **Contact site administrators**: Request permission for automated access

**Example fix**:
```typescript
// In BaseScraper.ts, increase delay between requests
await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
```

### 2. Translation API Quota Exceeded

**Problem**: Translation API quota limits are reached.

**Solutions**:
1. **Check quota**: Verify API usage in provider dashboard
2. **Upgrade plan**: Increase quota by upgrading API plan
3. **Cache translations**: Store previously translated content
4. **Batch requests**: Combine multiple translations in single requests
5. **Fallback mechanism**: Use alternative translation services

**Example fix**:
```bash
# Check current usage
curl -H "Authorization: Bearer $TRANSLATION_API_KEY" \
     "https://api.translation-service.com/v1/usage"
```

### 3. Vector DB Missing

**Problem**: Vector database is not available or configured incorrectly.

**Solutions**:
1. **Check configuration**: Verify `VECTOR_DB_DRIVER` in `.env`
2. **Install dependencies**: Ensure pgvector is installed (if using PostgreSQL)
3. **Start database**: Confirm database service is running
4. **Check credentials**: Verify database connection credentials
5. **Fallback to local**: Use local storage if database unavailable

**Example fix**:
```bash
# For pgvector, ensure PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -h localhost -U your_user -d your_db -c "SELECT extname FROM pg_extension WHERE extname = 'vector';"
```

### 4. Port Already in Use

**Problem**: LLM Engine API server fails to start due to port conflict.

**Solutions**:
1. **Change port**: Modify `PORT` in `.env`
2. **Kill process**: Terminate process using the port
3. **Check other services**: Ensure no other services are using the port

**Example fix**:
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill process (Windows)
taskkill /PID <process_id> /F

# Or change port in .env
echo "PORT=3002" >> .env
```

### 5. Database Connection Failed

**Problem**: Unable to connect to Supabase database.

**Solutions**:
1. **Check credentials**: Verify `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
2. **Network connectivity**: Ensure network access to Supabase
3. **Firewall settings**: Check firewall rules
4. **Service status**: Verify Supabase instance is running

**Example fix**:
```bash
# Test database connection
curl -I $SUPABASE_URL

# Check environment variables
echo $SUPABASE_URL
echo $SUPABASE_KEY
```

### 6. Missing API Keys

**Problem**: Required API keys are not set.

**Solutions**:
1. **Set environment variables**: Add keys to `.env`
2. **Verify format**: Ensure keys are in correct format
3. **Check permissions**: Verify API key permissions

**Example fix**:
```bash
# Add to .env
echo "OPENAI_API_KEY=your_openai_api_key" >> .env
echo "TRANSLATION_API_KEY=your_translation_api_key" >> .env
```

### 7. Permission Denied

**Problem**: Application lacks permissions to access files or directories.

**Solutions**:
1. **Check file permissions**: Ensure app has read/write access
2. **Run as administrator**: Use elevated privileges (Windows)
3. **Change ownership**: Adjust file ownership
4. **Directory permissions**: Verify cache directory permissions

**Example fix** (Windows):
```cmd
# Grant full control to current user
icacls "llm-engine\cache" /grant %USERNAME%:F
```

### 8. Memory Issues

**Problem**: Application runs out of memory during processing.

**Solutions**:
1. **Increase heap size**: Adjust Node.js memory limits
2. **Process in batches**: Handle data in smaller chunks
3. **Optimize code**: Reduce memory footprint
4. **Add swap space**: Increase virtual memory

**Example fix**:
```bash
# Increase Node.js heap size
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

### 9. Slow Performance

**Problem**: Application is running slower than expected.

**Solutions**:
1. **Profile code**: Identify performance bottlenecks
2. **Optimize queries**: Improve database queries
3. **Cache results**: Store frequently accessed data
4. **Parallel processing**: Use concurrent operations where possible

**Example fix**:
```bash
# Profile Node.js application
node --prof server.js
node --prof-process isolate-*.log > profile.txt
```

### 10. CORS Issues

**Problem**: Frontend cannot access LLM Engine API due to CORS restrictions.

**Solutions**:
1. **Configure CORS**: Update CORS settings in API server
2. **Add origins**: Include frontend origin in allowed list
3. **Proxy requests**: Use backend proxy for API calls

**Example fix**:
```typescript
// In server.ts
app.use(cors({
  origin: ['http://localhost:8080', 'https://your-frontend.com'],
  credentials: true
}));
```

## Debugging Commands

### Check Environment Variables
```bash
# List all environment variables
printenv | grep -E "(OPENAI|TRANSLATION|VECTOR|SUPABASE|CRON|EMBEDDING)"

# Check specific variable
echo $OPENAI_API_KEY
```

### Check Logs
```bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log

# View scraper logs in database
psql -h $SUPABASE_URL -U $SUPABASE_USER -d $SUPABASE_DB \
     -c "SELECT * FROM scraper_logs ORDER BY timestamp DESC LIMIT 10;"
```

### Test API Endpoints
```bash
# Test search endpoint
curl "http://localhost:3001/llm/search?query=tax&lang=en&limit=5"

# Test module retrieval
curl "http://localhost:3001/llm/module/tax-etax-registration-12345"

# Test quiz generation
curl -X POST "http://localhost:3001/llm/generate/quiz" \
     -H "Content-Type: application/json" \
     -d '{"module_id":"tax-etax-registration-12345"}'
```

### Database Diagnostics
```bash
# Check table counts
psql -h $SUPABASE_URL -U $SUPABASE_USER -d $SUPABASE_DB \
     -c "SELECT COUNT(*) FROM modules;"
     
psql -h $SUPABASE_URL -U $SUPABASE_USER -d $SUPABASE_DB \
     -c "SELECT COUNT(*) FROM scraper_logs;"

# Check for errors in logs
psql -h $SUPABASE_URL -U $SUPABASE_USER -d $SUPABASE_DB \
     -c "SELECT * FROM scraper_logs WHERE status = 'failed' ORDER BY timestamp DESC LIMIT 10;"
```

## Monitoring

### System Resources
```bash
# Check CPU usage
top  # Linux/Mac
taskmgr  # Windows

# Check memory usage
free -h  # Linux/Mac
wmic OS get TotalVisibleMemorySize /value  # Windows

# Check disk space
df -h  # Linux/Mac
dir  # Windows
```

### Application Metrics
```bash
# Check processed modules
ls -la processed/ | wc -l

# Check cache size
du -sh cache/

# Check vector database size
du -sh vectors/
```

## Contact Support

If you encounter issues not covered in this guide:

1. **Check GitHub Issues**: Search existing issues in the repository
2. **Create New Issue**: Provide detailed information about the problem
3. **Include Logs**: Attach relevant error logs and stack traces
4. **Environment Info**: Include OS, Node.js version, and dependencies
5. **Steps to Reproduce**: Provide clear reproduction steps

For urgent issues, contact the development team through the official support channels.