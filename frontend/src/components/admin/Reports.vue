<template>
  <div class="reports-container">
    <!-- Modern Notification -->
    <div 
      class="custom-notif"
      :class="[{ show: notification.show }, notification.type]"
    >
      <div class="notif-content">
        <div class="notif-icon">
          <svg v-if="notification.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        {{ notification.message }}
      </div>
    </div>

    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Business Reports</h1>
          <p class="page-subtitle">Track your business performance and analytics</p>
        </div>
        <div class="export-actions">
          <!-- Export Dropdown -->
          <div class="export-dropdown">
            <button class="btn btn-primary dropdown-toggle" @click="toggleExportDropdown">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L12 4M12 4L8 8M12 4L16 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 12H6C4.89543 12 4 12.8954 4 14V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V14C20 12.8954 19.1046 12 18 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Export Reports
            </button>
            <div v-if="showExportDropdown" class="dropdown-menu">
              <div class="dropdown-section">
                <label>Date Range</label>
                <div class="date-options">
                  <button 
                    v-for="option in dateOptions" 
                    :key="option.value"
                    :class="['date-option', { active: exportDateRange === option.value }]"
                    @click="setExportDateRange(option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
                
                <div v-if="exportDateRange === 'custom'" class="custom-date-range">
                  <div class="filter-group">
                    <label>From</label>
                    <input type="date" v-model="exportCustomStart" class="date-input">
                  </div>
                  <div class="filter-group">
                    <label>To</label>
                    <input type="date" v-model="exportCustomEnd" class="date-input">
                  </div>
                </div>
              </div>
              
              <div class="dropdown-section">
                <label>Export Format</label>
                <div class="export-buttons">
                  <button class="btn btn-secondary btn-sm" @click="exportCSV">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Export CSV
                  </button>
                  <button class="btn btn-primary btn-sm" @click="exportPDF">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card status-total-sales">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <span class="card-label">Total Sales</span>
          <span class="card-value">₱{{ stats.totalSales.toLocaleString() }}</span>
        </div>
      </div>

      <div class="summary-card status-total-users">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <span class="card-label">Total Users</span>
          <span class="card-value">{{ stats.totalUsers }}</span>
        </div>
      </div>

      <div class="summary-card status-delivered">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <span class="card-label">Delivered Orders</span>
          <span class="card-value">{{ orderSummary.delivered || 0 }}</span>
        </div>
      </div>

      <div class="summary-card status-pending">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <span class="card-label">Pending Orders</span>
          <span class="card-value">{{ orderSummary.pending || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <!-- Monthly Sales Chart -->
      <div class="chart-card large">
        <div class="chart-header">
          <h3>Monthly Sales Trend</h3>
          <div class="chart-actions">
            <button class="btn-icon" @click="refreshMonthlySales" title="Refresh Chart">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4V16C4 17.1046 4.89543 18 6 18H20M20 18L16 14M20 18L16 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="chart-container">
          <canvas id="monthlySalesChart"></canvas>
        </div>
        <div v-if="loading.monthlySales" class="chart-loading">
          Loading chart data...
        </div>
      </div>

      <!-- Daily Sales Chart -->
      <div class="chart-card large">
        <div class="chart-header">
          <h3>Daily Sales</h3>
          <div class="date-filters">
            <div class="filter-group">
              <label>From</label>
              <input type="date" v-model="dateRange.start" class="date-input">
            </div>
            <div class="filter-group">
              <label>To</label>
              <input type="date" v-model="dateRange.end" class="date-input">
            </div>
            <button class="btn btn-primary btn-sm" @click="loadDailySales">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Apply
            </button>
          </div>
        </div>
        <div class="chart-container">
          <canvas id="dailySalesChart"></canvas>
        </div>
      </div>

      <!-- Small Charts Grid -->
      <div class="small-charts-grid">
        <!-- Top Products Chart -->
        <div class="chart-card small">
          <div class="chart-header">
            <h3>Top Selling Products</h3>
          </div>
          <div class="chart-container">
            <canvas id="topProductsChart"></canvas>
          </div>
        </div>

        <!-- Order Status Chart -->
        <div class="chart-card small">
          <div class="chart-header">
            <h3>Order Status</h3>
          </div>
          <div class="chart-container">
            <canvas id="orderStatusChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Click outside handler for dropdown -->
    <div v-if="showExportDropdown" class="click-outside-handler" @click="showExportDropdown = false"></div>
  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";

// Import jsPDF separately to avoid autoTable issues
let jsPDF;
let autoTable;

// Dynamically import jsPDF and autoTable to avoid initialization issues
const loadPDFLibraries = async () => {
  if (!jsPDF) {
    jsPDF = (await import('jspdf')).default;
  }
  if (!autoTable) {
    autoTable = (await import('jspdf-autotable')).default;
  }
};

Chart.register(...registerables);

export default {
  name: "Reports",

  data() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    return {
      stats: {
        totalSales: 0,
        totalUsers: 0,
      },
      orderSummary: {},
      monthlySales: [],
      dailySales: [],
      topProducts: [],
      dateRange: {
        start: firstDay.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0],
      },
      charts: {},
      loading: {
        monthlySales: false
      },

      // New export data
      showExportDropdown: false,
      exportDateRange: 'today',
      exportCustomStart: '',
      exportCustomEnd: '',
      dateOptions: [
        { label: 'Today', value: 'today' },
        { label: 'This Week', value: 'week' },
        { label: 'This Month', value: 'month' },
        { label: 'Custom Range', value: 'custom' }
      ],
      salesData: [], // Will store filtered sales data for export
      
      // Notification system
      notification: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },

  mounted() {
    this.loadAllReports();
    this.setDefaultExportDates();
  },

  methods: {
    // Modern notification system
    showNotification(message, type = 'success') {
      this.notification.type = type;
      this.notification.message = message;
      this.notification.show = true;
      
      setTimeout(() => {
        this.notification.show = false;
      }, 4000);
    },

    auth() {
      return {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      };
    },

    // Export dropdown methods
    toggleExportDropdown() {
      this.showExportDropdown = !this.showExportDropdown;
    },

    setExportDateRange(range) {
      this.exportDateRange = range;
      if (range !== 'custom') {
        this.setDefaultExportDates();
      }
    },

    setDefaultExportDates() {
      const today = new Date();
      this.exportCustomEnd = today.toISOString().split('T')[0];
      
      switch(this.exportDateRange) {
        case 'today':
          this.exportCustomStart = today.toISOString().split('T')[0];
          break;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          this.exportCustomStart = weekAgo.toISOString().split('T')[0];
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          this.exportCustomStart = monthAgo.toISOString().split('T')[0];
          break;
      }
    },

    // Get date range for export
    getExportDateRange() {
      if (this.exportDateRange === 'custom') {
        return {
          start: this.exportCustomStart,
          end: this.exportCustomEnd
        };
      }
      return {
        start: this.exportCustomStart,
        end: this.exportCustomEnd
      };
    },

    // Load sales data for export
    async loadSalesForExport() {
      try {
        const dateRange = this.getExportDateRange();
        const response = await axios.get('/api/admin/reports/sales-detailed', {
          ...this.auth(),
          params: {
            start: dateRange.start,
            end: dateRange.end
          }
        });
        
        // Handle the response structure
        this.salesData = response.data.sales || [];
        return this.salesData;
        
      } catch (error) {
        console.error('Error loading sales data:', error);
        this.showNotification('Failed to load sales data', 'error');
        return [];
      }
    },

    // Enhanced Export Methods
    async exportCSV() {
      try {
        this.showExportDropdown = false;
        const salesData = await this.loadSalesForExport();
        
        if (salesData.length === 0) {
          this.showNotification('No sales data found for the selected date range', 'error');
          return;
        }

        const headers = ['Order ID', 'Date', 'Customer', 'Product', 'Quantity', 'Unit Price', 'Total Amount', 'Status', 'Size'];
        
        // Calculate totals
        const totalSales = salesData.reduce((sum, sale) => {
          const amount = parseFloat(sale.total_amount || (sale.unit_price * sale.quantity) || 0);
          return sum + amount;
        }, 0);
        
        const totalItems = salesData.reduce((sum, sale) => sum + (parseInt(sale.quantity) || 0), 0);
        const totalOrders = new Set(salesData.map(sale => sale.order_id)).size;

        const csvContent = [
          headers.join(','),
          ...salesData.map(sale => {
            const unitPrice = parseFloat(sale.unit_price || sale.price || 0);
            const quantity = parseInt(sale.quantity) || 0;
            const totalAmount = parseFloat(sale.total_amount || (unitPrice * quantity) || 0);
            
            return [
              sale.order_id,
              `"${this.formatDateForExport(sale.created_at)}"`,
              `"${sale.customer_name || 'N/A'}"`,
              `"${sale.product_name || 'N/A'}"`,
              quantity,
              unitPrice.toFixed(2),
              totalAmount.toFixed(2),
              sale.status || 'N/A',
              sale.product_size || 'N/A'
            ].join(',');
          }),
          '',
          'SUMMARY',
          `Total Orders,${totalOrders}`,
          `Total Items Sold,${totalItems}`,
          `Total Revenue,₱${this.formatNumber(totalSales)}`
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const dateRange = this.getExportDateRange();
        const fileName = `sales_report_${dateRange.start}_to_${dateRange.end}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('CSV exported successfully!', 'success');
      } catch (error) {
        console.error('Error exporting CSV:', error);
        this.showNotification('Error exporting CSV file', 'error');
      }
    },

    async exportPDF() {
      try {
        this.showExportDropdown = false;
        
        // Load PDF libraries dynamically
        await loadPDFLibraries();
        
        const salesData = await this.loadSalesForExport();
        
        if (salesData.length === 0) {
          this.showNotification('No sales data found for the selected date range', 'error');
          return;
        }

        const doc = new jsPDF();
        const dateRange = this.getExportDateRange();
        
        // Use basic fonts to avoid encoding issues
        doc.setFont('helvetica');
        
        // Title
        doc.setFontSize(20);
        doc.setTextColor(10, 60, 43);
        doc.text('Sales Report', 14, 22);
        
        // Date range
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Date Range: ${dateRange.start} to ${dateRange.end}`, 14, 32);
        
        // Calculate totals
        const totalSales = salesData.reduce((sum, sale) => {
          const amount = parseFloat(sale.total_amount || (sale.unit_price * sale.quantity) || 0);
          return sum + amount;
        }, 0);
        
        const totalOrders = new Set(salesData.map(sale => sale.order_id)).size;
        const totalItems = salesData.reduce((sum, sale) => sum + (parseInt(sale.quantity) || 0), 0);
        
        // Summary section - Use PHP instead of ₱ to avoid symbol issues
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Revenue: PHP ${this.formatNumber(totalSales)}`, 14, 45);
        doc.text(`Total Orders: ${totalOrders}`, 14, 52);
        doc.text(`Total Items Sold: ${totalItems}`, 14, 59);
        
        // Table
        const tableColumn = ['Order ID', 'Date', 'Customer', 'Product', 'Qty', 'Amount', 'Status'];
        const tableRows = [];
        
        salesData.forEach(sale => {
          const totalAmount = parseFloat(sale.total_amount || (sale.unit_price * sale.quantity) || 0);
          const saleData = [
            sale.order_id.toString(),
            this.formatDateForExport(sale.created_at),
            sale.customer_name || 'N/A',
            sale.product_name || 'N/A',
            (sale.quantity || 0).toString(),
            `PHP ${this.formatNumber(totalAmount)}`, // Use PHP instead of ₱
            sale.status || 'N/A'
          ];
          tableRows.push(saleData);
        });
        
        // Add autoTable with explicit font settings
        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 65,
          theme: 'grid',
          styles: {
            fontSize: 8,
            cellPadding: 3,
            font: 'helvetica',
            fontStyle: 'normal',
            textColor: [0, 0, 0],
            lineColor: [200, 200, 200],
            lineWidth: 0.1
          },
          headStyles: {
            fillColor: [10, 60, 43],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            font: 'helvetica',
            lineWidth: 0.1
          },
          bodyStyles: {
            font: 'helvetica',
            fontStyle: 'normal',
            textColor: [0, 0, 0],
            lineWidth: 0.1
          },
          alternateRowStyles: {
            fillColor: [240, 249, 245],
            textColor: [0, 0, 0]
          },
          margin: { top: 65 },
          didDrawPage: (data) => {
            // Add total summary at the bottom of the table
            const finalY = data.cursor.y + 10;
            if (data.pageNumber === data.pageCount) {
              doc.setFontSize(10);
              doc.setTextColor(10, 60, 43);
              doc.setFont('helvetica', 'bold');
              doc.text(`GRAND TOTAL: PHP ${this.formatNumber(totalSales)}`, 14, finalY);
              doc.setFont('helvetica', 'normal');
            }
          }
        });
        
        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.setFont('helvetica', 'normal');
          doc.text(
            `Page ${i} of ${pageCount} - Generated on ${new Date().toLocaleDateString()}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
        }
        
        const fileName = `sales_report_${dateRange.start}_to_${dateRange.end}.pdf`;
        doc.save(fileName);
        
        this.showNotification('PDF exported successfully!', 'success');
      } catch (error) {
        console.error('Error exporting PDF:', error);
        this.showNotification('Error exporting PDF file', 'error');
      }
    },

    // Add this helper method for proper number formatting
    formatNumber(number) {
      return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(number);
    },

    formatDateForExport(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    async loadAllReports() {
      await Promise.all([
        this.loadTotalSales(),
        this.loadTotalUsers(),
        this.loadOrderSummary(),
        this.loadMonthlySales(),
        this.loadDailySales(),
        this.loadTopProducts(),
      ]);
    },

    async loadTotalSales() {
      try {
        const res = await axios.get("/api/admin/reports/total-sales", this.auth());
        this.stats.totalSales = res.data.total_sales || 0;
      } catch (error) {
        console.error('Error loading total sales:', error);
        this.stats.totalSales = 0;
      }
    },

    async loadTotalUsers() {
      try {
        const res = await axios.get("/api/admin/reports/total-users", this.auth());
        this.stats.totalUsers = res.data.total_users || 0;
      } catch (error) {
        console.error('Error loading total users:', error);
        this.stats.totalUsers = 0;
      }
    },

    async loadOrderSummary() {
      try {
        const res = await axios.get("/api/admin/reports/orders-summary", this.auth());
        this.orderSummary = {};
        res.data.forEach(s => {
          this.orderSummary[s.status] = s.count;
        });
        this.buildOrderStatusChart();
      } catch (error) {
        console.error('Error loading order summary:', error);
        this.orderSummary = {};
      }
    },

    async loadMonthlySales() {
      this.loading.monthlySales = true;
      try {
        const res = await axios.get("/api/admin/reports/monthly-sales", this.auth());
        this.monthlySales = res.data;
        
        // Wait for next tick to ensure DOM is updated
        this.$nextTick(() => {
          this.buildMonthlySalesChart();
          this.loading.monthlySales = false;
        });
      } catch (error) {
        console.error('Error loading monthly sales:', error);
        this.monthlySales = [];
        this.$nextTick(() => {
          this.buildMonthlySalesChart();
          this.loading.monthlySales = false;
        });
      }
    },

    refreshMonthlySales() {
      this.loadMonthlySales();
    },

    async loadDailySales() {
      try {
        const res = await axios.get("/api/admin/reports/sales-per-day", {
          ...this.auth(),
          params: {
            start: this.dateRange.start || "2024-01-01",
            end: this.dateRange.end || "2099-12-31",
          }
        });
        this.dailySales = res.data;
        this.buildDailySalesChart();
      } catch (error) {
        console.error('Error loading daily sales:', error);
        this.dailySales = [];
      }
    },

    async loadTopProducts() {
      try {
        const res = await axios.get("/api/admin/reports/top-products", this.auth());
        this.topProducts = res.data;
        this.buildTopProductsChart();
      } catch (error) {
        console.error('Error loading top products:', error);
        this.topProducts = [];
      }
    },

    // Chart methods
    buildMonthlySalesChart() {
      const ctx = document.getElementById("monthlySalesChart");
      if (!ctx) {
        console.error('Monthly sales chart canvas not found');
        return;
      }

      // Destroy existing chart if it exists
      if (this.charts.monthly) {
        this.charts.monthly.destroy();
      }

      // Ensure we have data
      const labels = this.monthlySales.map(x => x.month) || [];
      const data = this.monthlySales.map(x => x.monthly_sales) || [];

      // If no data, show empty chart
      if (labels.length === 0) {
        console.warn('No monthly sales data available');
        labels.push('No Data');
        data.push(0);
      }

      try {
        this.charts.monthly = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Sales (₱)",
                data: data,
                borderColor: "#1e7952",
                backgroundColor: "#1e795240",
                borderWidth: 3,
                tension: 0.4,
                fill: true,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { 
                ticks: { color: "#333" }, 
                grid: { color: "#eee" } 
              },
              y: { 
                ticks: { 
                  color: "#333",
                  callback: function(value) {
                    return '₱' + value.toLocaleString();
                  }
                }, 
                grid: { color: "#eee" } 
              },
            },
            plugins: { 
              legend: { 
                labels: { color: "#333" } 
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Sales: ₱${context.parsed.y.toLocaleString()}`;
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Error building monthly sales chart:', error);
      }
    },

    buildDailySalesChart() {
      const ctx = document.getElementById("dailySalesChart");
      if (this.charts.daily) this.charts.daily.destroy();

      this.charts.daily = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.dailySales.map(x => x.date),
          datasets: [{
            label: "Daily Sales (₱)",
            data: this.dailySales.map(x => x.daily_sales),
            backgroundColor: "#1e7952"
          }]
        },
        options: {
            scales: {
                x: { ticks: { color: "#333" }, grid: { color: "#eee" } },
                y: { ticks: { color: "#333" }, grid: { color: "#eee" } },
            },
            plugins: { legend: { labels: { color: "#333" } } }
        }
      });
    },

    buildTopProductsChart() {
      const ctx = document.getElementById("topProductsChart");
      if (this.charts.top) this.charts.top.destroy();

      this.charts.top = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.topProducts.map(x => x.name),
          datasets: [{
            label: "Units Sold",
            data: this.topProducts.map(x => x.total_sold),
            backgroundColor: "#0a3c2b"
          }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: { ticks: { color: "#333" }, grid: { color: "#eee" } },
                y: { ticks: { color: "#333" }, grid: { color: "#eee" } },
            },
            plugins: { legend: { labels: { color: "#333" } } }
        }
      });
    },

    buildOrderStatusChart() {
      const ctx = document.getElementById("orderStatusChart");
      if (this.charts.status) this.charts.status.destroy();

      this.charts.status = new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(this.orderSummary),
          datasets: [{
            data: Object.values(this.orderSummary),
            backgroundColor: ["#1e7952", "#0a3c2b", "#7f8c8d", "#c0392b"],
            hoverBackgroundColor: ["#53b584", "#0a3c2b", "#95a5a6", "#e74c3c"]
          }]
        },
        options: {
            plugins: { legend: { labels: { color: "#333" } } }
        }
      });
    },
  }
};
</script>

<style scoped>
/* Add notification styles */
.custom-notif {
  position: fixed;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  color: white;
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 10000;
  min-width: 300px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.custom-notif.show {
  top: 24px;
  opacity: 1;
  pointer-events: auto;
}

.custom-notif.success {
  background: linear-gradient(135deg, #1a7d5e, #0a3c2b);
  border-left: 4px solid #10b981;
}

.custom-notif.error {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  border-left: 4px solid #f56565;
}

.notif-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notif-icon {
  display: flex;
  align-items: center;
}

/* Rest of your existing styles remain the same */
.reports-container {
  padding: 24px;
  background: #f8fdfb;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.header-section {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.title-section .page-title {
  color: #0a3c2b;
  font-weight: 700;
  font-size: 32px;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.title-section .page-subtitle {
  color: #4a7c6d;
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}

.export-actions {
  display: flex;
  gap: 12px;
}

.export-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e0f0e9;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(10, 60, 43, 0.15);
  min-width: 300px;
  z-index: 1000;
}

.dropdown-section {
  margin-bottom: 16px;
}

.dropdown-section:last-child {
  margin-bottom: 0;
}

.dropdown-section label {
  display: block;
  color: #0a3c2b;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.date-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.date-option {
  padding: 8px 12px;
  border: 1px solid #e0f0e9;
  background: #f8fdfb;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #4a7c6d;
  cursor: pointer;
  transition: all 0.3s ease;
}

.date-option:hover {
  border-color: #1a7d5e;
  color: #0a3c2b;
}

.date-option.active {
  background: #1a7d5e;
  color: white;
  border-color: #1a7d5e;
}

.custom-date-range {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
}

.export-buttons {
  display: flex;
  gap: 8px;
}

.export-buttons .btn {
  flex: 1;
  justify-content: center;
}

.click-outside-handler {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #1a7d5e;
  color: white;
}

.btn-primary:hover {
  background: #0a3c2b;
}

.btn-secondary {
  background: #f0f9f5;
  color: #1a7d5e;
  border: 1px solid #c8e6d9;
}

.btn-secondary:hover {
  background: #e0f0e9;
}

.btn-sm {
  padding: 8px 12px;
  font-size: 13px;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e0f0e9;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4a7c6d;
}

.btn-icon:hover {
  background: #f0f9f5;
  border-color: #1a7d5e;
  color: #0a3c2b;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(10, 60, 43, 0.12);
}

.summary-card.status-total-users {
  border-left: 4px solid #1e40af;
}

.summary-card.status-total-sales {
  border-left: 4px solid  #f59e0b;
}

.summary-card.status-delivered {
  border-left: 4px solid #047857;
}

.summary-card.status-pending {
  border-left: 4px solid #dc2626;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: #f0f9f5;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a7d5e;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-label {
  color: #4a7c6d;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.card-value {
  color: #0a3c2b;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}

.charts-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.small-charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
  position: relative;
}

.chart-card.large {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.chart-card.small {
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  color: #0a3c2b;
  font-weight: 600;
  font-size: 18px;
  margin: 0;
}

.date-filters {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-group label {
  color: #4a7c6d;
  font-size: 12px;
  font-weight: 500;
}

.date-input {
  padding: 6px 8px;
  border: 1px solid #c8e6d9;
  border-radius: 6px;
  background: #f8fdfb;
  color: #0a3c2b;
  font-size: 13px;
  outline: none;
  transition: all 0.3s ease;
}

.date-input:focus {
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

.chart-container {
  height: 100%;
  min-height: 300px;
  position: relative;
  flex: 1;
  width: 100%;
}

.chart-actions {
  display: flex;
  gap: 8px;
}

.chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #4a7c6d;
  font-size: 14px;
  font-weight: 500;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-delivered {
  background: #d1fae5;
  color: #065f46;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-processing {
  background: #dbeafe;
  color: #1e40af;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #4a7c6d;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .reports-container {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .export-actions {
    justify-content: center;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .small-charts-grid {
    grid-template-columns: 1fr;
  }
  
  .date-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .dropdown-menu {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 400px;
  }
}

@media (max-width: 480px) {
  .summary-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .card-icon {
    width: 40px;
    height: 40px;
  }
  
  .card-value {
    font-size: 20px;
  }

  .date-options {
    grid-template-columns: 1fr;
  }

  .custom-date-range {
    grid-template-columns: 1fr;
  }

  .export-buttons {
    flex-direction: column;
  }
}
</style>