import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Line, Bar, Pie, Scatter, Doughnut, PolarArea, Radar } from 'react-chartjs-2';
import { getFileData } from '../../store/slices/filesSlice';
import { generateInsights } from '../../store/slices/analyticsSlice';
import { FaDownload } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

// Color schemes for different chart types
const colorSchemes = {
  line: {
    backgroundColor: 'rgba(75, 192, 192, 0.5)',
    borderColor: 'rgb(75, 192, 192)',
  },
  bar: {
    backgroundColor: [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(199, 199, 199, 0.7)',
      'rgba(83, 102, 255, 0.7)',
      'rgba(40, 159, 64, 0.7)',
      'rgba(210, 199, 199, 0.7)',
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)',
      'rgb(199, 199, 199)',
      'rgb(83, 102, 255)',
      'rgb(40, 159, 64)',
      'rgb(210, 199, 199)',
    ],
  },
  pie: {
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(255, 159, 64, 0.5)',
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)',
    ],
  },
  scatter: {
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
    borderColor: 'rgb(255, 99, 132)',
  },
  doughnut: {
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(255, 159, 64, 0.5)',
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)',
    ],
  },
  polarArea: {
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(255, 159, 64, 0.5)',
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)',
    ],
  },
  radar: {
    backgroundColor: 'rgba(75, 192, 192, 0.5)',
    borderColor: 'rgb(75, 192, 192)',
  },
};

const Analytics = () => {
  const { fileId } = useParams();
  const dispatch = useDispatch();
  const { currentFile, loading, error } = useSelector((state) => state.files);
  const { insights, loading: insightsLoading } = useSelector((state) => state.analytics);
  const [chartType, setChartType] = useState('line');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartData, setChartData] = useState(null);
  const [showInsights, setShowInsights] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    if (fileId) {
      dispatch(getFileData(fileId));
    }
  }, [dispatch, fileId]);

  const generateChartData = useCallback(() => {
    if (!currentFile || !xAxis || !yAxis) {
      console.log('Missing data for chart:', { currentFile, xAxis, yAxis });
      return;
    }
    
    console.log('Generating chart data:', { currentFile, xAxis, yAxis });
    
    const labels = currentFile.data.map(row => row[xAxis]);
    const data = currentFile.data.map(row => {
      const value = row[yAxis];
      return typeof value === 'number' ? value : parseFloat(value);
    });

    const colors = colorSchemes[chartType];
    
    // For pie, doughnut, and polar area charts, we need a different data structure
    if (['pie', 'doughnut', 'polarArea'].includes(chartType)) {
      setChartData({
        labels,
        datasets: [{
          label: yAxis,
          data,
          ...colors,
          borderWidth: 1,
        }],
      });
    } 
    // For scatter plots, we need x and y coordinates
    else if (chartType === 'scatter') {
      setChartData({
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data: currentFile.data.map(row => ({
            x: row[xAxis],
            y: row[yAxis]
          })),
          ...colors,
          pointRadius: 6,
          pointHoverRadius: 8,
        }],
      });
    }
    // For radar charts
    else if (chartType === 'radar') {
      setChartData({
        labels,
        datasets: [{
          label: yAxis,
          data,
          ...colors,
          borderWidth: 1,
          fill: true,
        }],
      });
    }
    // For line and bar charts
    else {
      setChartData({
        labels,
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data,
          ...colors,
          borderWidth: 1,
        }],
      });
    }

    // After setting chart data, generate insights
    dispatch(generateInsights(fileId));
    setShowInsights(true);
  }, [currentFile, xAxis, yAxis, chartType, dispatch, fileId]);

  useEffect(() => {
    generateChartData();
  }, [generateChartData]);

  const handleDownload = async () => {
    if (!xAxis || !yAxis) {
      alert('Please select both X and Y axes before downloading the chart');
      return;
    }

    try {
      // Get the chart instance
      const chart = chartRef.current;
      if (!chart) {
        throw new Error('Chart not found');
      }

      // Get the canvas element
      const canvas = chart.canvas;
      
      // Create a temporary canvas with white background
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      // Fill with white background
      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Draw the chart on top
      tempCtx.drawImage(canvas, 0, 0);
      
      // Convert to blob
      tempCanvas.toBlob((blob) => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chart-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      alert('Error downloading chart: ' + error.message);
    }
  };

  const renderChart = () => {
    if (!chartData) {
      return (
        <div className="text-center p-8">
          <p className="text-gray-500">Select X and Y axes to view the chart</p>
        </div>
      );
    }

    // Base options for all charts
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${yAxis} vs ${xAxis}`,
        },
      },
    };

    // Specific options for different chart types
    const chartSpecificOptions = {
      line: {
        ...baseOptions,
        scales: {
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      },
      bar: {
        ...baseOptions,
        scales: {
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      },
      scatter: {
        ...baseOptions,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            type: 'linear',
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      },
      pie: {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      },
      doughnut: {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      },
      polarArea: {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}`;
              }
            }
          }
        }
      },
      radar: {
        ...baseOptions,
        scales: {
          r: {
            angleLines: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }
    };

    const chartProps = {
      ref: chartRef,
      data: chartData,
      options: chartSpecificOptions[chartType] || baseOptions
    };

    switch (chartType) {
      case 'line':
        return <Line {...chartProps} />;
      case 'bar':
        return <Bar {...chartProps} />;
      case 'pie':
        return <Pie {...chartProps} />;
      case 'scatter':
        return <Scatter {...chartProps} />;
      case 'doughnut':
        return <Doughnut {...chartProps} />;
      case 'polarArea':
        return <PolarArea {...chartProps} />;
      case 'radar':
        return <Radar {...chartProps} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-red-600">
          <p className="text-xl font-semibold mb-2">Error Loading Analysis</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!currentFile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-gray-600">
          <p className="text-xl font-semibold">No file data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-200 shadow-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">{currentFile.originalName}</h1>
            <button
              onClick={handleDownload}
              className="relative group inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-lg opacity-50"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300"></span>
              <span className="relative flex items-center text-white">
                <FaDownload className="mr-2 h-4 w-4" />
                Download Analysis
              </span>
            </button>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Chart Type</h2>
            <div className="space-y-4">
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="w-full bg-white border border-orange-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="scatter">Scatter Plot</option>
                <option value="doughnut">Doughnut Chart</option>
                <option value="polarArea">Polar Area Chart</option>
                <option value="radar">Radar Chart</option>
              </select>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Axis Selection</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">X-Axis</label>
                <select
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select X-Axis</option>
                  {currentFile.columns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Y-Axis</label>
                <select
                  value={yAxis}
                  onChange={(e) => setYAxis(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Y-Axis</option>
                  {currentFile.columns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Summary</h2>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Rows</p>
                <p className="text-2xl font-bold text-gray-800">{currentFile.data.length}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Columns</p>
                <p className="text-lg text-gray-800">{currentFile.columns.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Chart Visualization</h2>
          <div className="h-96 bg-white rounded-lg p-4">
            {renderChart()}
          </div>
        </div>

        {showInsights && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis</h2>
            {insightsLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : insights ? (
              <div className="prose max-w-none text-gray-700">
                <div className="whitespace-pre-wrap">{insights}</div>
              </div>
            ) : (
              <div className="text-center p-4 text-gray-600">
                No insights available. Please select axes to generate analysis.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics; 