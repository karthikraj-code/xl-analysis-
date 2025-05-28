import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseExcelFile } from '../../utils/excelProcessor';
import { generateInsights } from '../../ai/config';
import * as Switch from '@radix-ui/react-switch';
import * as Label from '@radix-ui/react-label';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { toast } from 'react-hot-toast';

export default function AIAnalysis() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoading, setIsLoading] = useState({ parsing: false, generatingInsights: false });
  const [error, setError] = useState(null);
  const [showAiInsights, setShowAiInsights] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsLoading(prev => ({ ...prev, parsing: true }));
    setError(null);
    setParsedData(null);
    setAiInsights(null);

    try {
      const data = await parseExcelFile(selectedFile);
      setParsedData(data);
      toast.success('File uploaded successfully!', {
        duration: 2000,
        position: 'top-center',
      });
      // Navigate to files after a short delay
      setTimeout(() => {
        navigate('/files');
      }, 2000);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to upload file: ' + err.message, {
        duration: 3000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, parsing: false }));
    }
  };

  const handleGenerateInsights = useCallback(async () => {
    if (!parsedData || parsedData.rows.length === 0) {
      setError("Cannot generate insights without data.");
      setShowAiInsights(false);
      return;
    }

    setIsLoading(prev => ({ ...prev, generatingInsights: true }));
    setAiInsights(null);
    setError(null);

    try {
      // Limit to first 50 rows for performance
      const dataForInsights = parsedData.rows.slice(0, 50);
      const insights = await generateInsights(dataForInsights);
      setAiInsights(insights);
      toast.success('AI insights generated successfully!', {
        duration: 2000,
        position: 'top-center',
      });
    } catch (err) {
      setError("Failed to generate AI insights: " + err.message);
      setShowAiInsights(false);
      toast.error('Failed to generate insights: ' + err.message, {
        duration: 3000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, generatingInsights: false }));
    }
  }, [parsedData]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* File Upload Section */}
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Upload Excel File</h2>
          <input
            type="file"
            accept=".xls,.xlsx,.csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {isLoading.parsing && (
            <p className="mt-2 text-sm text-gray-500">Processing file...</p>
          )}
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* AI Insights Section */}
        {parsedData && parsedData.rows.length > 0 && (
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">AI Data Insights</h2>
              <div className="flex items-center space-x-2">
                <Switch.Root
                  id="ai-insights-toggle"
                  checked={showAiInsights}
                  onCheckedChange={setShowAiInsights}
                  disabled={isLoading.generatingInsights}
                  className="w-[42px] h-[25px] bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-default"
                >
                  <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                </Switch.Root>
                <Label.Root htmlFor="ai-insights-toggle" className="text-sm font-medium">
                  Enable AI Insights
                </Label.Root>
              </div>
            </div>

            {isLoading.generatingInsights && (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            )}

            {!isLoading.generatingInsights && showAiInsights && aiInsights && (
              <div className="p-4 bg-gray-50 rounded-md border">
                <p className="text-sm whitespace-pre-wrap">{aiInsights}</p>
              </div>
            )}

            {!isLoading.generatingInsights && showAiInsights && !aiInsights && (
              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Generate Insights
                  </button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="fixed inset-0 bg-black/30" />
                  <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-md w-full">
                    <AlertDialog.Title className="text-lg font-semibold mb-2">
                      Generate AI Insights
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-sm text-gray-600 mb-4">
                      This will analyze the first 50 rows of your data to generate insights. Continue?
                    </AlertDialog.Description>
                    <div className="flex justify-end space-x-2">
                      <AlertDialog.Cancel asChild>
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                          Cancel
                        </button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <button
                          onClick={handleGenerateInsights}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          Generate
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 