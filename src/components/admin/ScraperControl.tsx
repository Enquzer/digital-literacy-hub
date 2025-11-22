import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Play, Pause } from 'lucide-react';

interface ScraperLog {
  id: string;
  source_url: string;
  status: 'success' | 'failed' | 'warning';
  message: string;
  timestamp: string;
}

interface ScraperStatus {
  source: string;
  lastRun: string;
  status: 'running' | 'idle' | 'error';
  lastError?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

const ScraperControl: React.FC = () => {
  const [logs, setLogs] = useState<ScraperLog[]>([]);
  const [status, setStatus] = useState<ScraperStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<ScraperLog[]>>('/admin/logs');
      
      if (response.data.success) {
        setLogs(response.data.data);
      } else {
        setError(response.data.error || 'Failed to fetch logs');
      }
    } catch (err) {
      setError('Failed to fetch logs');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      // In a real implementation, this would fetch actual scraper status
      // For now, we'll use placeholder data
      const placeholderStatus: ScraperStatus[] = [
        {
          source: 'e-Tax Portal',
          lastRun: new Date().toISOString(),
          status: 'idle'
        },
        {
          source: 'Customs Portal',
          lastRun: new Date(Date.now() - 3600000).toISOString(),
          status: 'idle'
        },
        {
          source: 'Ministry of Revenues',
          lastRun: new Date(Date.now() - 86400000).toISOString(),
          status: 'idle'
        }
      ];
      
      setStatus(placeholderStatus);
    } catch (err) {
      setError('Failed to fetch status');
      console.error('Error fetching status:', err);
    }
  };

  const runScraper = async (source: string) => {
    try {
      // In a real implementation, this would trigger a specific scraper
      // For now, we'll just show a message
      alert(`Running scraper for ${source}`);
    } catch (err) {
      setError('Failed to run scraper');
      console.error('Error running scraper:', err);
    }
  };

  const reprocessModule = async (moduleId: string) => {
    try {
      // In a real implementation, this would trigger module reprocessing
      // For now, we'll just show a message
      alert(`Reprocessing module ${moduleId}`);
    } catch (err) {
      setError('Failed to reprocess module');
      console.error('Error reprocessing module:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchStatus();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">LLM Engine Admin</h2>
        <Button onClick={fetchLogs} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scraper Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {status.map((scraper, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{scraper.source}</h3>
                    <p className="text-sm text-gray-500">
                      Last run: {new Date(scraper.lastRun).toLocaleString()}
                    </p>
                    {scraper.lastError && (
                      <p className="text-sm text-red-500">{scraper.lastError}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      scraper.status === 'running' ? 'default' : 
                      scraper.status === 'error' ? 'destructive' : 'secondary'
                    }>
                      {scraper.status}
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => runScraper(scraper.source)}
                      disabled={scraper.status === 'running'}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{log.source_url}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={
                      log.status === 'success' ? 'default' : 
                      log.status === 'failed' ? 'destructive' : 'secondary'
                    }>
                      {log.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm">{log.message}</p>
                  {log.status === 'failed' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => reprocessModule(log.id)}
                    >
                      Reprocess
                    </Button>
                  )}
                </div>
              ))}
              
              {logs.length === 0 && !loading && (
                <p className="text-center text-gray-500 py-4">No activity logs found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => alert('Triggering full knowledge base update')}>
              Update Knowledge Base
            </Button>
            <Button variant="outline" onClick={() => alert('Configuring scheduler')}>
              Configure Scheduler
            </Button>
            <Button variant="outline" onClick={() => alert('Viewing module versions')}>
              View Module Versions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScraperControl;