import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [authResult, setAuthResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testValidToken = async () => {
    setIsLoading(true);
    setAuthResult(null);
    addLog('Testing with valid token...');

    try {
      const response = await fetch('/api/auth');
      const data = await response.json();

      const result = await (window as any).Village.authorize(
        data.token,
        'localhost:3003',
        async () => {
          addLog('Refresh callback called');
          const refreshResponse = await fetch('/api/refresh-village-token', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          const refreshData = await refreshResponse.json();
          addLog('Token refreshed successfully');
          return refreshData.token;
        }
      );

      setAuthResult(result);
      addLog(`Authorization result: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testInvalidToken = async () => {
    setIsLoading(true);
    setAuthResult(null);
    addLog('Testing with invalid token (should trigger refresh)...');

    try {
      const result = await (window as any).Village.authorize(
        'invalid-token-that-will-fail',
        'localhost:3003',
        async () => {
          addLog('Refresh callback triggered due to invalid token');
          const refreshResponse = await fetch('/api/refresh-village-token', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (!refreshResponse.ok) {
            throw new Error('Refresh failed');
          }
          
          const refreshData = await refreshResponse.json();
          addLog('Token refreshed successfully');
          return refreshData.token;
        }
      );

      setAuthResult(result);
      addLog(`Authorization result: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setAuthResult(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>🧪 Village Token Authorization Testing</CardTitle>
        <CardDescription>
          Test the new Village SDK token authorization with refresh callback functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={testValidToken} disabled={isLoading}>
            Test Valid Token
          </Button>
          <Button onClick={testInvalidToken} disabled={isLoading} variant="outline">
            Test Invalid Token (Triggers Refresh)
          </Button>
          <Button onClick={clearLogs} variant="outline">
            Clear Logs
          </Button>
        </div>

        {authResult && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Authorization Result:</h3>
            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
              {JSON.stringify(authResult, null, 2)}
            </pre>
          </div>
        )}

        {logs.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Console Logs:</h3>
            <div className="bg-black text-green-400 p-3 rounded text-xs font-mono max-h-48 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 border-l-4 border-blue-400 pl-4">
          <p className="font-semibold">What happens:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li><strong>Valid Token:</strong> Direct authorization, no refresh needed</li>
            <li><strong>Invalid Token:</strong> SDK automatically calls the refresh callback</li>
            <li><strong>Refresh Success:</strong> Retries authorization with new token</li>
            <li><strong>Refresh Failure:</strong> Returns <code>{`{ ok: false, status: 'unauthorized' }`}</code></li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}