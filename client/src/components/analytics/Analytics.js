import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Line, Bar, Pie, Scatter, Doughnut, PolarArea, Radar } from 'react-chartjs-2';
import { getFileData } from '../../store/slices/filesSlice';
import { generateInsights } from '../../store/slices/analyticsSlice';
import { FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ChartRecommendationBot from './ChartRecommendationBot';
import ThreeDChart from './ThreeDChart';
import ThreeDPieChart from './ThreeDPieChart';
import ThreeDScatterPlot from './ThreeDScatterPlot';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
  Legend,
  ChartDataLabels
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
  const [zAxis, setZAxis] = useState('');
  const [chartData, setChartData] = useState(null);
  const [showInsights, setShowInsights] = useState(false);
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);
  const insightsContainerRef = useRef(null);
  const threeDChartRef = useRef();
  const threeDPieRef = useRef();
  const threeDScatterRef = useRef();

  // Add chart customization options
  const [chartOptions, setChartOptions] = useState({
    showLegend: true,
    showGrid: true,
    showDataLabels: false,
    animationDuration: 1000
  });

  // Add state for chart dimension
  const [chartDimension, setChartDimension] = useState('2d');

  // Base options for all charts
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${yAxis} vs ${xAxis}`,
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y !== undefined ? context.parsed.y : context.raw;
            return new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(value);
          }
        }
      },
      datalabels: {
        display: false
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 4,
        borderWidth: 0
      },
      line: {
        tension: 0.4
      }
    }
  };

  // Update chart specific options
  const chartSpecificOptions = {
    line: {
      ...baseOptions,
      elements: {
        point: {
          radius: 0,
          hoverRadius: 4,
          borderWidth: 0
        },
        line: {
          tension: 0.4
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11,
              family: "'Inter', sans-serif"
            },
            padding: 10,
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8
          }
        },
        y: {
          display: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            font: {
              size: 11,
              family: "'Inter', sans-serif"
            },
            padding: 10,
            callback: function(value) {
              return new Intl.NumberFormat('en-US', {
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(value);
            }
          }
        }
      }
    },
    bar: {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          ...baseOptions.plugins.tooltip,
          callbacks: {
            label: function(context) {
              const value = context.parsed.y;
              return new Intl.NumberFormat('en-US', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(value);
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11,
              family: "'Inter', sans-serif"
            },
            padding: 10,
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8
          }
        },
        y: {
          display: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            font: {
              size: 11,
              family: "'Inter', sans-serif"
            },
            padding: 10,
            callback: function(value) {
              return new Intl.NumberFormat('en-US', {
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(value);
            }
          }
        }
      }
    },
    scatter: {
      ...baseOptions,
      elements: {
        point: {
          radius: 3,
          hoverRadius: 6,
          borderWidth: 0
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          display: true,
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11,
              family: "'Inter', sans-serif"
            },
            padding: 10,
            maxTicksLimit: 8
          }
        },
        y: {
          type: 'linear',
          display: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            font: {
              size: 11,
              family: "'Inter', sans-serif"
            },
            padding: 10,
            maxTicksLimit: 8
          }
        }
      }
    },
    pie: {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          ...baseOptions.plugins.tooltip,
          callbacks: {
            label: function(context) {
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${percentage}%`;
            }
          }
        }
      }
    },
    doughnut: {
      ...baseOptions,
      cutout: '60%',
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          ...baseOptions.plugins.tooltip,
          callbacks: {
            label: function(context) {
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${percentage}%`;
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
          ...baseOptions.plugins.tooltip,
          callbacks: {
            label: function(context) {
              return new Intl.NumberFormat('en-US').format(context.raw || 0);
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
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          pointLabels: {
            display: true,
            font: {
              size: 11,
              family: "'Inter', sans-serif"
            }
          },
          ticks: {
            display: true
          }
        }
      }
    }
  };

  useEffect(() => {
    if (fileId) {
      dispatch(getFileData(fileId));
    }
  }, [dispatch, fileId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generateChartData = useCallback(() => {
    if (!currentFile || !xAxis || !yAxis || (chartType === '3d-scatter' && !zAxis)) {
      console.log('Missing data for chart:', { currentFile, xAxis, yAxis, zAxis });
      return;
    }
    
    console.log('Generating chart data:', { currentFile, xAxis, yAxis, zAxis });
    
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

    // For 3D scatter plots, we need x, y, and z coordinates
    if (chartType === '3d-scatter') {
      setChartData({
        datasets: [
          {
            label: `${zAxis} vs ${yAxis} vs ${xAxis}`,
            data: currentFile.data.map(row => ({
              x: parseFloat(row[xAxis]),
              y: parseFloat(row[yAxis]),
              z: parseFloat(row[zAxis]),
              label: row[xAxis] || ''
            })),
          },
        ],
        labels: currentFile.data.map(row => row[xAxis]),
      });
    }

    // For 3D Bar and Pie charts
    if (['3d-bar', '3d-pie'].includes(chartType)) {
      setChartData({
        datasets: [
          {
            label: `${zAxis} vs ${yAxis} vs ${xAxis}`,
            data: currentFile.data.map(row => ({
              x: parseFloat(row[xAxis]),
              y: parseFloat(row[yAxis]),
              z: parseFloat(row[zAxis]),
              label: row[xAxis] || ''
            })),
          },
        ],
        labels: currentFile.data.map(row => row[xAxis]),
      });
    }

    // After setting chart data, generate insights
    dispatch(generateInsights(fileId));
    setShowInsights(true);
  }, [currentFile, xAxis, yAxis, zAxis, chartType, dispatch, fileId]);

  useEffect(() => {
    generateChartData();
  }, [generateChartData]);

  useEffect(() => {
    if (!chartType) return;
    const token = localStorage.getItem('token');
    axios.post('/api/analytics/track-chart-usage', { chartType }, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {});
  }, [chartType]);

  const handleDownload = async () => {
    if (!xAxis || !yAxis) {
      alert('Please select both X and Y axes before downloading the chart');
      return;
    }
    if (["3d-bar", "3d-pie", "3d-scatter"].includes(chartType)) {
      toast.error('Currently, there is no option for downloading 3D charts as PNG.');
      return;
    }
    try {
      // Get the chart instance from the ref
      const chartInstance = chartRef.current;
      if (!chartInstance || !chartInstance.canvas) {
        console.error('Chart instance or canvas not found:', chartInstance);
        throw new Error('Chart not found. Please ensure the chart is properly rendered.');
      }
      // Get the canvas element
      const canvas = chartInstance.canvas;
      if (!canvas) {
        throw new Error('Canvas element not found');
      }
      // Create a temporary canvas with white background and willReadFrequently attribute
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canvas, 0, 0);
      // For scatter plots, ensure we're capturing the entire chart area
      if (chartType === 'scatter') {
        const padding = 20;
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = tempCanvas.width + (padding * 2);
        finalCanvas.height = tempCanvas.height + (padding * 2);
        const finalCtx = finalCanvas.getContext('2d', { willReadFrequently: true });
        finalCtx.fillStyle = 'white';
        finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        finalCtx.drawImage(tempCanvas, padding, padding);
        finalCanvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('Failed to create image blob');
          }
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `scatter-plot-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
      } else {
        tempCanvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('Failed to create image blob');
          }
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `chart-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
      }
    } catch (error) {
      console.error('Error downloading chart:', error);
      alert('Error downloading chart: ' + error.message);
    }
  };

  const handleDownloadPDF = async () => {
    if (!xAxis || !yAxis) {
      alert('Please select both X and Y axes before downloading the analysis');
      return;
    }
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yOffset = margin;
      // Add title
      pdf.setFontSize(20);
      pdf.text('Excel Data Analysis Report', pageWidth / 2, yOffset, { align: 'center' });
      yOffset += 15;
      // Add file information
      pdf.setFontSize(12);
      pdf.text(`Excel File: ${currentFile.originalName}`, margin, yOffset);
      yOffset += 10;
      pdf.text(`Analysis Date: ${new Date().toLocaleDateString()}`, margin, yOffset);
      yOffset += 15;
      // Add chart configuration
      pdf.setFontSize(14);
      pdf.text('Excel Chart Configuration', margin, yOffset);
      yOffset += 10;
      pdf.setFontSize(12);
      pdf.text(`Chart Type: ${chartType}`, margin, yOffset);
      yOffset += 7;
      pdf.text(`X-Axis: ${xAxis}`, margin, yOffset);
      yOffset += 7;
      pdf.text(`Y-Axis: ${yAxis}`, margin, yOffset);
      yOffset += 15;
      // 3D chart: capture multiple angles
      if (["3d-bar", "3d-pie", "3d-scatter"].includes(chartType)) {
        const angles = [
          { key: 'front', label: 'Front View' },
          { key: 'side', label: 'Side View' },
          { key: 'top', label: 'Top View' }
        ];
        let chartRef = null;
        if (chartType === '3d-bar') chartRef = threeDChartRef;
        if (chartType === '3d-pie') chartRef = threeDPieRef;
        if (chartType === '3d-scatter') chartRef = threeDScatterRef;
        for (const angle of angles) {
          if (chartRef && chartRef.current && chartRef.current.setCameraAngle) {
            chartRef.current.setCameraAngle(angle.key);
            // Wait for the camera to update and render
            await new Promise(res => setTimeout(res, 500));
            const imgData = chartRef.current.captureImage();
            if (imgData) {
              pdf.addPage();
              pdf.setFontSize(16);
              pdf.text(`${angle.label}`, margin, margin + 10);
              const chartWidth = pageWidth - (2 * margin);
              const chartHeight = chartWidth * 0.6;
              pdf.addImage(imgData, 'PNG', margin, margin + 20, chartWidth, chartHeight);
            }
          }
        }
      } else if (chartContainerRef.current) {
        // 2D chart fallback
        const chartCanvas = await html2canvas(chartContainerRef.current);
        const chartImgData = chartCanvas.toDataURL('image/png');
        const chartWidth = pageWidth - (2 * margin);
        const chartHeight = (chartCanvas.height * chartWidth) / chartCanvas.width;
        pdf.addPage();
        pdf.setFontSize(16);
        const chartTitle = 'Excel Chart Visualization';
        const chartTitleWidth = pdf.getStringUnitWidth(chartTitle) * 16 / pdf.internal.scaleFactor;
        const chartTitleX = (pageWidth - chartTitleWidth) / 2;
        pdf.text(chartTitle, chartTitleX, margin + 10);
        pdf.addImage(chartImgData, 'PNG', margin, margin + 20, chartWidth, chartHeight);
        yOffset = margin + chartHeight + 30;
      }
      // Add AI Insights
      if (insights && insightsContainerRef.current) {
        pdf.addPage();
        pdf.setFontSize(14);
        pdf.text('Excel AI Analysis Insights', margin, margin);
        yOffset = margin + 10;
        const insightsCanvas = await html2canvas(insightsContainerRef.current);
        const insightsImgData = insightsCanvas.toDataURL('image/png');
        const insightsWidth = pageWidth - (2 * margin);
        const insightsHeight = (insightsCanvas.height * insightsWidth) / insightsCanvas.width;
        pdf.addImage(insightsImgData, 'PNG', margin, yOffset, insightsWidth, insightsHeight);
      }
      // Save the PDF
      pdf.save(`excel-analysis-report-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report: ' + error.message);
    }
  };

  const handleChartOptionChange = (option, value) => {
    setChartOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  // Update the chart options based on customization
  const getUpdatedChartOptions = (type) => {
    const options = JSON.parse(JSON.stringify(chartSpecificOptions[type] || baseOptions));
    
    // Update legend visibility
    if (options.plugins) {
      options.plugins.legend = {
        ...options.plugins.legend,
        display: chartOptions.showLegend
      };
    }
    
    // Update grid visibility
    if (options.scales) {
      if (options.scales.x) {
        options.scales.x = {
          ...options.scales.x,
          grid: {
            display: chartOptions.showGrid
          }
        };
      }
      if (options.scales.y) {
        options.scales.y = {
          ...options.scales.y,
          grid: {
            display: chartOptions.showGrid
          }
        };
      }
    }
    
    // Update animation duration
    if (options.animation) {
      options.animation = {
        ...options.animation,
        duration: chartOptions.animationDuration
      };
    }
    
    // Update data labels
    if (chartOptions.showDataLabels) {
      options.plugins.datalabels = {
        display: true,
        color: '#4b5563',
        font: {
          size: 11,
          family: "'Inter', sans-serif"
        },
        formatter: (value) => {
          return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1
          }).format(value);
        }
      };
    }
    
    return options;
  };

  const renderChart = () => {
    if (!chartData || !chartData.datasets) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    // For scatter plots, we don't need labels
    if (chartType !== 'scatter' && !chartData.labels) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    const chartProps = {
      ref: chartRef,
      data: chartData,
      options: getUpdatedChartOptions(chartType)
    };

    switch (chartType) {
      case 'line':
        return <Line {...chartProps} />;
      case 'bar':
        return <Bar {...chartProps} />;
      case 'pie':
        return <Pie {...chartProps} />;
      case 'scatter':
        // Use the already properly formatted scatter data
        const scatterData = {
          datasets: [{
            ...chartData.datasets[0],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        };

        const scatterOptions = {
          ...getUpdatedChartOptions('scatter'),
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              title: {
                display: true,
                text: xAxis
              }
            },
            y: {
              type: 'linear',
              title: {
                display: true,
                text: yAxis
              }
            }
          },
          plugins: {
            ...getUpdatedChartOptions('scatter').plugins,
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `(${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
                }
              }
            }
          }
        };

        return <Scatter ref={chartRef} data={scatterData} options={scatterOptions} />;
      case 'doughnut':
        return <Doughnut {...chartProps} />;
      case 'polarArea':
        return <PolarArea {...chartProps} />;
      case 'radar':
        return <Radar {...chartProps} />;
      case '3d-bar':
        return (
          <div className="w-full h-full">
            {zAxis ? <ThreeDChart ref={threeDChartRef} data={chartData.datasets[0].data} /> : <div className="text-gray-500">Select Z-Axis for 3D Bar Chart</div>}
          </div>
        );
      case '3d-pie':
        return (
          <div className="w-full h-full">
            {zAxis ? <ThreeDPieChart ref={threeDPieRef} data={chartData.datasets[0].data} /> : <div className="text-gray-500">Select Z-Axis for 3D Pie Chart</div>}
          </div>
        );
      case '3d-scatter':
        return (
          <div className="w-full h-full">
            <ThreeDScatterPlot ref={threeDScatterRef} data={chartData.datasets[0].data} />
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Select a chart type</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-red-600">
          <p className="text-xl font-semibold mb-2">Error Loading Analysis</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!currentFile) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-gray-600">
          <p className="text-xl font-semibold">No file data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">{currentFile.originalName}</h1>
            <button
              onClick={handleDownload}
              className="relative group inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600 rounded-lg opacity-50"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300"></span>
              <span className="relative flex items-center text-white">
                <FaDownload className="mr-2 h-4 w-4" />
                Download  generated Chart
              </span>
            </button>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Chart Type</h2>
            <div className="space-y-4">
              {/* Chart Dimension Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Chart Dimension</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setChartDimension('2d');
                      setChartType('line'); // Reset to default 2D chart
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg border ${
                      chartDimension === '2d'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    2D Charts
                  </button>
                  <button
                    onClick={() => {
                      setChartDimension('3d');
                      setChartType('3d-bar'); // Reset to default 3D chart
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg border ${
                      chartDimension === '3d'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    3D Charts
                  </button>
                </div>
              </div>

              {/* Chart Type Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {chartDimension === '2d' ? '2D Chart Type' : '3D Chart Type'}
                </label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {chartDimension === '2d' ? (
                    <>
                      <option value="line">Line Chart</option>
                      <option value="bar">Bar Chart</option>
                      <option value="pie">Pie Chart</option>
                      <option value="scatter">Scatter Plot</option>
                      <option value="doughnut">Doughnut Chart</option>
                      <option value="polarArea">Polar Area Chart</option>
                      <option value="radar">Radar Chart</option>
                    </>
                  ) : (
                    <>
                      <option value="3d-bar">3D Bar Chart</option>
                      <option value="3d-pie">3D Pie Chart</option>
                      <option value="3d-scatter">3D Scatter Plot</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Axis Selection</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">X-Axis</label>
                <select
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full bg-white border border-blue-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Y-Axis</option>
                  {currentFile.columns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>
              {['3d-bar', '3d-pie', '3d-scatter'].includes(chartType) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Z-Axis</label>
                  <select
                    value={zAxis}
                    onChange={(e) => setZAxis(e.target.value)}
                    className="w-full bg-white border border-blue-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Z-Axis</option>
                    {currentFile.columns.map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Summary</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Rows</p>
                <p className="text-2xl font-bold text-gray-800">{currentFile.data.length}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Columns</p>
                <p className="text-lg text-gray-800">{currentFile.columns.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Customization */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Chart Customization</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showLegend"
                checked={chartOptions.showLegend}
                onChange={(e) => handleChartOptionChange('showLegend', e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-500"
              />
              <label htmlFor="showLegend" className="text-sm text-gray-700">Show Legend</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showGrid"
                checked={chartOptions.showGrid}
                onChange={(e) => handleChartOptionChange('showGrid', e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-500"
              />
              <label htmlFor="showGrid" className="text-sm text-gray-700">Show Grid</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showDataLabels"
                checked={chartOptions.showDataLabels}
                onChange={(e) => handleChartOptionChange('showDataLabels', e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-500"
              />
              <label htmlFor="showDataLabels" className="text-sm text-gray-700">Show Data Labels</label>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="animationDuration" className="text-sm text-gray-700">Animation Duration:</label>
              <select
                id="animationDuration"
                value={chartOptions.animationDuration}
                onChange={(e) => handleChartOptionChange('animationDuration', parseInt(e.target.value))}
                className="form-select text-sm border-gray-300 rounded-md"
              >
                <option value="0">None</option>
                <option value="500">Fast</option>
                <option value="1000">Normal</option>
                <option value="2000">Slow</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chart Recommendation Bot */}
        <div className="mb-6">
          <ChartRecommendationBot
            xAxis={xAxis}
            yAxis={yAxis}
            data={currentFile?.data}
          />
        </div>

        {/* Chart Visualization */}
        <div ref={chartContainerRef} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Chart Visualization</h2>
          <div className="h-96 bg-gradient-to-br from-white to-blue-50 rounded-lg p-4 shadow-inner border border-blue-100">
            {renderChart()}
          </div>
        </div>

        {showInsights && (
          <div ref={insightsContainerRef} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis</h2>
            {insightsLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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

        {/* Add download PDF button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-500 via-pink-500 to-pink-500 hover:from-purple-600 hover:via-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <FaDownload className="mr-2 h-4 w-4" />
            Download Excel Analysis Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 