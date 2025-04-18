// --- Variabel Global Chart ---
window.totalAttendanceChartInstance = null;
window.teacherSummaryChartInstance = null;

// --- Fungsi Helper Warna Chart ---
const getChartColors = () => ({
  textColor: "#374151",
  gridColor: "rgba(0, 0, 0, 0.05)",
  tooltipBg: "#ffffff",
  tooltipText: "#1f2937",
  doughnutBorder: "#ffffff",
  barBgSiswa: "#4f46e5",
  barBgGuru: "#06b6d4",
  colorHadirGuru: "#10b981",
  colorAbsenGuru: "#ef4444",
  colorIzinGuru: "#f59e0b",
  colorTerlambatGuru: "#f97316",
});

// --- Inisialisasi Chart.js (Global Scope) ---
window.initCharts = (selectedUserType) => {
  // Fungsi ini sekarang global, dipanggil dari dalam komponen Alpine
  const themeColors = getChartColors();
  console.log("Initializing charts for dashboard user type:", selectedUserType);

  // Hancurkan chart lama
  if (window.totalAttendanceChartInstance)
    window.totalAttendanceChartInstance.destroy();
  if (window.teacherSummaryChartInstance)
    window.teacherSummaryChartInstance.destroy();
  window.totalAttendanceChartInstance = null;
  window.teacherSummaryChartInstance = null;

  // Contoh Data (Sesuaikan dengan data asli)
  const studentMonthlyAttendance = [
    570, 630, 400, 500, 450, 600, 700, 650, 580, 620, 680, 710,
  ];
  const teacherMonthlyAttendance = [
    70, 72, 68, 71, 65, 73, 74, 70, 69, 72, 71, 74,
  ];
  const teacherTodaySummary = [70, 2, 1, 2]; // Hadir, Absen, Izin, Terlambat
  const chartLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  // 1. Total Attendance Report (Bar Chart)
  const totalAttendanceCtx = document
    .getElementById("totalAttendanceChart")
    ?.getContext("2d");
  if (totalAttendanceCtx) {
    let datasets = [];
    let chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: themeColors.gridColor,
            borderColor: themeColors.gridColor,
          },
          ticks: { color: themeColors.textColor },
        },
        x: {
          grid: { display: false },
          ticks: { color: themeColors.textColor },
        },
      },
      plugins: {
        legend: { display: true, position: "top" },
        tooltip: {
          backgroundColor: themeColors.tooltipBg,
          titleColor: themeColors.tooltipText,
          bodyColor: themeColors.tooltipText,
          padding: 10,
          boxPadding: 4,
          cornerRadius: 4,
        },
      },
    };

    if (selectedUserType === "siswa") {
      datasets.push({
        label: "Kehadiran Siswa",
        data: studentMonthlyAttendance,
        backgroundColor: themeColors.barBgSiswa,
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      });
      chartOptions.plugins.legend.display = false;
    } else if (selectedUserType === "guru") {
      datasets.push({
        label: "Kehadiran Guru",
        data: teacherMonthlyAttendance,
        backgroundColor: themeColors.barBgGuru,
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      });
      chartOptions.plugins.legend.display = false;
    } else if (selectedUserType === "semua") {
      datasets.push({
        label: "Siswa",
        data: studentMonthlyAttendance,
        backgroundColor: themeColors.barBgSiswa,
        borderRadius: 4,
        barPercentage: 0.9,
        categoryPercentage: 0.6,
      });
      datasets.push({
        label: "Guru",
        data: teacherMonthlyAttendance,
        backgroundColor: themeColors.barBgGuru,
        borderRadius: 4,
        barPercentage: 0.9,
        categoryPercentage: 0.6,
      });
      chartOptions.plugins.legend.display = true;
    }

    window.totalAttendanceChartInstance = new Chart(totalAttendanceCtx, {
      type: "bar",
      data: { labels: chartLabels, datasets: datasets },
      options: chartOptions,
    });
    console.log("Total attendance chart created/updated.");
  } else {
    console.error("Canvas context for totalAttendanceChart not found.");
  }

  // 2. Teacher Summary Today (Doughnut Chart) - Hanya jika tipe = guru
  const teacherSummaryCtx = document
    .getElementById("teacherSummaryChart")
    ?.getContext("2d");
  if (teacherSummaryCtx && selectedUserType === "guru") {
    window.teacherSummaryChartInstance = new Chart(teacherSummaryCtx, {
      type: "doughnut",
      data: {
        labels: ["Hadir", "Absen", "Izin/Sakit", "Terlambat"],
        datasets: [
          {
            label: "Ringkasan Guru Hari Ini",
            data: teacherTodaySummary,
            backgroundColor: [
              themeColors.colorHadirGuru,
              themeColors.colorAbsenGuru,
              themeColors.colorIzinGuru,
              themeColors.colorTerlambatGuru,
            ],
            borderColor: themeColors.doughnutBorder,
            borderWidth: 3,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: themeColors.textColor,
              boxWidth: 12,
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: themeColors.tooltipBg,
            titleColor: themeColors.tooltipText,
            bodyColor: themeColors.tooltipText,
            padding: 10,
            boxPadding: 4,
            cornerRadius: 4,
          },
        },
      },
    });
    console.log("Teacher summary chart created.");
  } else if (selectedUserType === "guru") {
    console.error("Canvas context for teacherSummaryChart not found.");
  } else {
    console.log("Teacher summary chart skipped (not guru filter).");
  }
}; // End initCharts

// --- Definisi Komponen Alpine.js ---
function presensiAppData() {
  return {
    // === State ===
    dashboardUserType: "siswa",
    userManagementFilterType: "semua",
    userManagementStatusFilter: "",
    userManagementSearchQuery: "",
    activeTab: "dashboard",
    isMobileMenuOpen: false,
    isUserMenuOpen: false,
    selectedUserIds: [],
    selectAllUsers: false,
    users: [
      {
        id: "user1",
        name: "Andi Dwi Saputra",
        email: "andi.dwi@email.com",
        userId: "12345",
        role: "siswa",
        roleBadge: "badge-indigo",
        class: "11 IPA 1",
        status: "aktif",
        statusBadge: "badge-green",
        avatar: "https://placehold.co/100x100/818CF8/FFFFFF?text=AD",
      },
      {
        id: "user2",
        name: "Rani Agustina",
        email: "rani.a@email.com",
        userId: "12346",
        role: "siswa",
        roleBadge: "badge-indigo",
        class: "11 IPA 2",
        status: "aktif",
        statusBadge: "badge-green",
        avatar: "https://placehold.co/100x100/FCA5A5/FFFFFF?text=RA",
      },
      {
        id: "user3",
        name: "Anita Dewi",
        email: "anita.d@guru.id",
        userId: "G002",
        role: "guru",
        roleBadge: "badge-cyan",
        class: "-",
        status: "aktif",
        statusBadge: "badge-green",
        avatar: "https://placehold.co/100x100/FBBF24/000000?text=AN",
      },
      {
        id: "user4",
        name: "Budi Santoso",
        email: "budi.s@guru.id",
        userId: "G001",
        role: "guru",
        roleBadge: "badge-cyan",
        role2: "petugas_piket",
        role2Badge: "badge-purple",
        class: "-",
        status: "aktif",
        statusBadge: "badge-green",
        avatar: "https://placehold.co/100x100/F87171/FFFFFF?text=BU",
      },
      {
        id: "user5",
        name: "Citra Lestari",
        email: "citra.l@guru.id",
        userId: "G003",
        role: "guru",
        roleBadge: "badge-cyan",
        role2: "petugas_piket",
        role2Badge: "badge-purple",
        class: "-",
        status: "nonaktif",
        statusBadge: "badge-gray",
        avatar: "https://placehold.co/100x100/A78BFA/FFFFFF?text=CT",
      },
    ],

    // === Computed Property ===
    get filteredUsers() {
      return this.users.filter((user) => {
        const typeMatch =
          this.userManagementFilterType === "semua" ||
          user.role === this.userManagementFilterType ||
          (this.userManagementFilterType === "petugas_piket" &&
            user.role2 === "petugas_piket");
        const statusMatch =
          this.userManagementStatusFilter === "" ||
          user.status === this.userManagementStatusFilter;
        const classMatch = true; // Placeholder
        const searchMatch =
          this.userManagementSearchQuery === "" ||
          user.name
            .toLowerCase()
            .includes(this.userManagementSearchQuery.toLowerCase()) ||
          user.userId
            .toLowerCase()
            .includes(this.userManagementSearchQuery.toLowerCase());
        return typeMatch && statusMatch && classMatch && searchMatch;
      });
    },

    // === Inisialisasi ===
    init() {
      console.log("Alpine component initialized.");
      this.$nextTick(() => this.renderIcons());
      if (this.activeTab === "dashboard") {
        this.initializeDashboardCharts();
      }
      this.updateFooterYear();
      this.updateLastUpdatedTime();

      // Watchers
      this.$watch("dashboardUserType", (newValue) => {
        if (this.activeTab === "dashboard") {
          console.log("Dashboard filter changed:", newValue);
          this.initializeDashboardCharts();
        }
        this.$nextTick(() => this.renderIcons());
      });
      this.$watch("userManagementFilterType", (newValue) => {
        console.log("User type filter changed:", newValue);
        this.clearSelection();
        this.$nextTick(() => this.renderIcons());
      });
      this.$watch("userManagementStatusFilter", (newValue) => {
        console.log("User status filter changed:", newValue);
        this.clearSelection();
        this.$nextTick(() => this.renderIcons());
      });
      this.$watch("userManagementSearchQuery", (newValue) => {
        console.log("User search query changed:", newValue);
        this.clearSelection();
        this.$nextTick(() => this.renderIcons());
      });
      this.$watch("activeTab", (newTab, oldTab) => {
        console.log(`Tab changed from ${oldTab} to ${newTab}`);
        if (newTab === "dashboard") {
          this.updateLastUpdatedTime();
          this.initializeDashboardCharts();
        } else if (oldTab === "dashboard") {
          this.destroyCharts();
        }
        if (newTab !== "pengguna") {
          this.clearSelection();
        }
        this.$nextTick(() => this.renderIcons());
      });
      this.$watch("selectedUserIds", (newSelection) => {
        if (this.filteredUsers.length > 0) {
          const filteredUserIds = this.filteredUsers.map((u) => u.id);
          this.selectAllUsers =
            newSelection.length > 0 &&
            newSelection.length === filteredUserIds.length &&
            filteredUserIds.every((id) => newSelection.includes(id));
        } else {
          this.selectAllUsers = false;
        }
        console.log(
          "Selection changed:",
          newSelection,
          "Select All:",
          this.selectAllUsers
        );
      });
    },

    // === Metode Helper ===
    renderIcons() {
      if (typeof lucide !== "undefined") {
        console.log("Rendering Lucide icons...");
        try {
          lucide.createIcons();
        } catch (e) {
          console.error("Error rendering Lucide icons:", e);
        }
      } else {
        console.warn("Lucide library not found.");
      }
    },
    updateFooterYear() {
      const currentYearSpan = document.getElementById("current-year");
      if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
      }
    },
    updateLastUpdatedTime() {
      const lastUpdatedSpan = document.getElementById("last-updated-time");
      if (lastUpdatedSpan && this.activeTab === "dashboard") {
        const now = new Date();
        lastUpdatedSpan.textContent = now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    },
    initializeDashboardCharts() {
      console.log(
        "Attempting to initialize dashboard charts from component..."
      );
      if (typeof window.initCharts === "function") {
        window.initCharts(this.dashboardUserType); // Panggil fungsi global
      } else {
        console.warn("Global initCharts function not found.");
      }
    },
    destroyCharts() {
      console.log("Destroying charts from component...");
      if (window.totalAttendanceChartInstance) {
        window.totalAttendanceChartInstance.destroy();
        window.totalAttendanceChartInstance = null;
        console.log("Total attendance chart destroyed.");
      }
      if (window.teacherSummaryChartInstance) {
        window.teacherSummaryChartInstance.destroy();
        window.teacherSummaryChartInstance = null;
        console.log("Teacher summary chart destroyed.");
      }
    },
    changeTab(tabName) {
      if (this.activeTab !== tabName) {
        this.activeTab = tabName;
        this.isMobileMenuOpen = false;
        // Watcher 'activeTab' akan handle sisanya
      }
    },

    // === Metode Manajemen Pengguna ===
    toggleSelection(userId) {
      const index = this.selectedUserIds.indexOf(userId);
      if (index > -1) {
        this.selectedUserIds.splice(index, 1);
      } else {
        this.selectedUserIds.push(userId);
      }
    },
    selectAllFilteredUsers(checked) {
      const filteredUserIds = this.filteredUsers.map((u) => u.id);
      if (checked) {
        this.selectedUserIds = [
          ...new Set([...this.selectedUserIds, ...filteredUserIds]),
        ];
      } else {
        this.selectedUserIds = this.selectedUserIds.filter(
          (id) => !filteredUserIds.includes(id)
        );
      }
    },
    clearSelection() {
      this.selectedUserIds = [];
      this.selectAllUsers = false; // Pastikan ini juga direset
    },
    applyBulkAction(action) {
      if (this.selectedUserIds.length === 0) {
        alert("Pilih setidaknya satu pengguna.");
        return;
      }
      const selectedNames = this.users
        .filter((u) => this.selectedUserIds.includes(u.id))
        .map((u) => u.name)
        .join(", ");
      let confirmationMessage = "";
      switch (action) {
        case "activate":
          confirmationMessage = `Anda yakin ingin mengaktifkan pengguna berikut?\n${selectedNames}`;
          break;
        case "deactivate":
          confirmationMessage = `Anda yakin ingin menonaktifkan pengguna berikut?\n${selectedNames}`;
          break;
        case "delete":
          confirmationMessage = `PERINGATAN: Anda yakin ingin MENGHAPUS pengguna berikut secara permanen?\n${selectedNames}`;
          break;
        default:
          return;
      }

      if (confirm(confirmationMessage)) {
        console.log(
          `Applying action "${action}" to users:`,
          this.selectedUserIds
        );
        // TODO: Implementasikan logika backend
        this.users = this.users.map((user) => {
          if (this.selectedUserIds.includes(user.id)) {
            if (action === "activate")
              return {
                ...user,
                status: "aktif",
                statusBadge: "badge-green",
              };
            if (action === "deactivate")
              return {
                ...user,
                status: "nonaktif",
                statusBadge: "badge-gray",
              };
          }
          return user;
        });
        if (action === "delete") {
          this.users = this.users.filter(
            (user) => !this.selectedUserIds.includes(user.id)
          );
        }
        alert(
          `Aksi "${action}" berhasil diterapkan pada ${this.selectedUserIds.length} pengguna.`
        );
        this.clearSelection();
      }
    },
    viewUser(userId) {
      const user = this.users.find((u) => u.id === userId);
      alert(
        `Lihat Detail Pengguna:\nNama: ${user.name}\nID: ${user.userId}\nRole: ${user.role}\nStatus: ${user.status}`
      );
      // TODO: Implementasikan modal
    },
    editUser(userId) {
      const user = this.users.find((u) => u.id === userId);
      alert(`Edit Pengguna:\nNama: ${user.name}`);
      // TODO: Implementasikan modal
    },
    deleteUser(userId) {
      const user = this.users.find((u) => u.id === userId);
      if (
        confirm(
          `Anda yakin ingin menghapus pengguna "${user.name}" (${user.userId})?`
        )
      ) {
        console.log("Deleting user:", userId);
        // TODO: Implementasikan logika backend
        this.users = this.users.filter((u) => u.id !== userId);
        alert(`Pengguna "${user.name}" berhasil dihapus.`);
        this.clearSelection();
      }
    },
  };
}

// --- Pendaftaran Komponen Alpine.js ---
document.addEventListener("alpine:init", () => {
  console.log("Alpine initialized, registering component...");
  Alpine.data("presensiApp", presensiAppData);
});

// --- Inisialisasi Lainnya (jika perlu, setelah DOM siap) ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  // Anda bisa menambahkan inisialisasi non-Alpine lain di sini jika perlu
  // Contoh: memastikan Lucide dipanggil jika belum oleh Alpine
  if (typeof lucide !== "undefined") {
    // Beri sedikit waktu agar Alpine sempat render elemennya
    setTimeout(() => {
      console.log("Manual Lucide render check after DOM load");
      lucide.createIcons();
    }, 100);
  }
});
