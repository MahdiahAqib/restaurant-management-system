import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import styles from '../../../styles/Dashboard.module.css';
import AdminLayout from '../../../components/AdminLayout';

import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  BarController,
  DoughnutController,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  BarController,
  DoughnutController,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // State management
  const [staffCount, setStaffCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [timeFrameRevenueTrend, setTimeFrameRevenueTrend] = useState('Today');
  const [timeFrameSaleCategory, setTimeFrameSaleCategory] = useState('week');
  const [categoryBarData, setCategoryBarData] = useState({
    labels: [],
    datasets: []
  });
  const [RevenueTrendData, setRevenueTrendData] = useState({
    labels: [],
    datasets: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dateRangeLabel, setDateRangeLabel] = useState('');

  // Fallback data for loading states
  const fallbackCategoryData = {
    labels: ['Loading...'],
    datasets: [{
      label: 'Loading Data',
      data: [1],
      backgroundColor: ['rgba(200, 200, 200, 0.2)'],
      borderColor: ['rgba(200, 200, 200, 1)'],
      borderWidth: 1
    }]
  };

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/dashboard?timeframe=${timeFrameSaleCategory}&revenueFrame=${timeFrameRevenueTrend}`
        );
        const data = await response.json(); // First get the complete response as 'data'
        console.log("data:", data)
        
        // Then destructure from 'data'
        const {
          staffCount = 0,
          userCount = 0,
          totalRevenue = 0,
          categorySales = {},
          dateRangeLabel = '',
          unmatchedItems = [],
          revenueTrend = []
        } = data;
  
        // Update all state in one pass
        setStaffCount(staffCount);
        setUserCount(userCount);
        setTotalRevenue(totalRevenue);
        setDateRangeLabel(dateRangeLabel);
  
        // Transform category sales data for chart
        const chartData = {
          labels: Object.keys(categorySales),
          datasets: [{
            label: `Sales (${timeFrameSaleCategory})`,
            data: Object.values(categorySales),
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(170, 102, 204, 0.7)',
              'rgba(75, 192, 192, 0.7)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(170, 102, 204, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1,
            borderRadius: 6
          }]
        };
  
        setCategoryBarData(chartData);
        
        // Generate labels dynamically based on selected revenue frame
        let trendLabels = [];
        
        if (timeFrameRevenueTrend === 'Today') {
          trendLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        } else if (timeFrameRevenueTrend === 'This week') {
          trendLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        } else if (timeFrameRevenueTrend === 'This month') {
          trendLabels = revenueTrend.map((_, i) => `Week ${i + 1}`);
        } else if (timeFrameRevenueTrend === 'This year') {
          trendLabels = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];
        } else if (timeFrameRevenueTrend === 'Yearly') {
          const currentYear = new Date().getFullYear();
          trendLabels = revenueTrend.map((_, i) => `${currentYear - 5 + i}`);
        }
        
        // Revenue Trend Line Chart
        const trendChartData = {
          labels: trendLabels,
          datasets: [
            {
              label: `Revenue (${timeFrameRevenueTrend})`,
              data: revenueTrend,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
              tension: 0.4,
              fill: true
            }
          ]
        };
        
        console.log("revenueTrendData:", trendChartData);

        setRevenueTrendData(trendChartData);
  
        // Now correctly using the destructured unmatchedItems
        if (unmatchedItems.length) {
          console.warn('Uncategorized items:', unmatchedItems);
        }
  
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Optionally set error state here
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDashboardStats();
  }, [timeFrameSaleCategory, timeFrameRevenueTrend]);

  // Static chart data configurations
  const orderStatusData = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [{
      data: [70, 20, 10],
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
      borderColor: '#1e1e1e',
      borderWidth: 2,
      hoverOffset: 10
    }]
  };


  const customerTrendData = {
    day: [100, 120, 150, 80, 90, 110, 130],
    week: [800, 1000, 1200, 900, 1100, 1250, 1300],
    month: [3500, 4000, 4500, 4300, 4600, 4700, 4800],
  };

  const customerLineData = {
    labels: timeFrameRevenueTrend === 'day' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            timeFrameRevenueTrend === 'week' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Visitors',
      data: customerTrendData[timeFrameRevenueTrend],
      borderColor: '#4BC0C0',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.3,
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#4BC0C0',
      pointHoverRadius: 6,
      borderWidth: 2
    }]
  };

  const customerRatingData = {
    labels: ['Food Quality', 'Service', 'Ambiance', 'Value'],
    datasets: [{
      label: 'Ratings (out of 5)',
      data: [4.5, 4.2, 4.7, 4.3],
      backgroundColor: [
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 1,
      borderRadius: 6
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ddd',
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        titleColor: '#fff',
        bodyColor: '#ddd',
        borderColor: '#444',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#aaa'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#aaa'
        }
      }
    }
  };

  const doughnutOptions = {
    ...chartOptions,
    cutout: '65%',
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: 'bottom'
      }
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard | Restaurant Admin</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.heading}>Dashboard</h1>


        {/* Top metrics */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Today's Reservations</span>
            <h2 className={styles.metricValue}>34</h2>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Active Orders</span>
            <h2 className={styles.metricValue}>12</h2>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Total Revenue</span>
            <h2 className={styles.metricValue}>${totalRevenue}</h2>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Total Staff</span>
            <h2 className={styles.metricValue}>{staffCount}</h2>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Total Customers</span>
            <h2 className={styles.metricValue}>{userCount}</h2>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Total Menu Items</span>
            <h2 className={styles.metricValue}>120</h2>
          </div>
        </div>

        {/* First row of charts */}
        <div className={styles.chartRow}>
          <div className={styles.chartBox}>
            <div className={styles.chartTitle}>Order Status Breakdown</div>
            <div className={`${styles.chartContent} ${styles.doughnutChart}`}>
              <Doughnut data={orderStatusData} options={doughnutOptions} />
            </div>
          </div>
          <div className={styles.chartBox}>
            <div className={styles.chartTitle}>
              Revenue Trend
              <select
            className={styles.timeFrameDropdown}
            value={timeFrameRevenueTrend}
            onChange={(e) => setTimeFrameRevenueTrend(e.target.value)}
          >
            <option value="Today">Today</option>
            <option value="This week">This Week</option>
            <option value="This month">This Month</option>
            <option value="This year">This Year</option>
            <option value="Yearly">Yearly</option>
          </select>

            </div>
            <div className={`${styles.chartContent} ${styles.lineChart}`}>
              <Line data={RevenueTrendData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Second row of charts */}
        <div className={styles.chartRow}>
          <div className={styles.chartBox}>
            <div className={styles.chartTitle}>
              Sales by Category
              <select 
                className={styles.timeFrameDropdown} 
                value={timeFrameSaleCategory} 
                onChange={(e) => setTimeFrameSaleCategory(e.target.value)}
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            {/* Date range display */}
            {dateRangeLabel && (
              <div className={styles.dateRangeDisplay}>
                Showing data for: {dateRangeLabel}
              </div>
            )}
            <div className={`${styles.chartContent} ${styles.barChart}`}>
              {isLoading ? (
                <Bar data={fallbackCategoryData} options={chartOptions} />
              ) : (
                <Bar data={categoryBarData} options={chartOptions} />
              )}
            </div>
          </div>
          <div className={styles.chartBox}>
            <div className={styles.chartTitle}>Customer Ratings</div>
            <div className={`${styles.chartContent} ${styles.barChart}`}>
              <Bar data={customerRatingData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Third row of charts */}
        <div className={styles.chartRow}>
          <div className={styles.chartBox}>
            <div className={styles.chartTitle}>Customer Visits Trend</div>
            <div className={`${styles.chartContent} ${styles.lineChart}`}>
              <Line data={customerLineData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Top Selling Items Table */}
        <div className={styles.tableBox}>
          <h3 className={styles.chartTitle}>Top Selling Items</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>🍔 Cheese Burger</td>
                <td>120</td>
                <td>$600</td>
              </tr>
              <tr>
                <td>🍕 Margherita Pizza</td>
                <td>90</td>
                <td>$720</td>
              </tr>
              <tr>
                <td>🥤 Chocolate Shake</td>
                <td>80</td>
                <td>$320</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

Dashboard.getLayout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);

export default Dashboard;