import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddModal from "../modals/AddModal";
import ChangeModal from "../modals/ChangeModal";
import {
  asyncSetIsLostFoundDelete,
  asyncSetIsLostFoundChange,
  asyncSetLostFounds,
  asyncSetLostFoundStats,
  setIsLostFoundDeleteActionCreator,
} from "../states/action";
import {
  formatDate,
  getImageUrl,
  showConfirmDialog,
  transformStatsData,
} from "../../../helpers/toolsHelper";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconChecklist,
  IconCircleCheck,
  IconClock,
  IconEye,
  IconPencil,
  IconTrash,
  IconLoader2,
  IconChartBar,
  IconUser,
  IconMapPin,
  IconAlertCircle,
} from "@tabler/icons-react";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile);
  const lostFounds = useSelector((state) => state.lostFounds);
  const isLostFoundDeleted = useSelector((state) => state.isLostFoundDeleted);
  const lostFoundStats = useSelector((state) => state.lostFoundStats);

  const [loadingItems, setLoadingItems] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [completedFilter, setCompletedFilter] = useState("");
  const [isMeFilter, setIsMeFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statsType, setStatsType] = useState("daily");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoadingItems(true);
    const options = {
      status: statusFilter,
      is_completed: completedFilter,
      is_me: isMeFilter ? "1" : "",
    };
    Promise.resolve(dispatch(asyncSetLostFounds(options))).finally(() => {
      if (isMounted) setLoadingItems(false);
    });
    return () => {
      isMounted = false;
    };
  }, [statusFilter, completedFilter, isMeFilter, dispatch]);

  useEffect(() => {
    dispatch(asyncSetLostFoundStats({ type: statsType }));
  }, [statsType, dispatch]);

  useEffect(() => {
    let isMounted = true;
    if (isLostFoundDeleted) {
      dispatch(setIsLostFoundDeleteActionCreator(false));
      setLoadingItems(true);
      const options = {
        status: statusFilter,
        is_completed: completedFilter,
        is_me: isMeFilter ? "1" : "",
      };
      Promise.resolve(dispatch(asyncSetLostFounds(options))).finally(() => {
        if (isMounted) setLoadingItems(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isLostFoundDeleted, statusFilter, completedFilter, isMeFilter, dispatch]);

  if (!profile) return null;

  async function handleDeleteItem(id) {
    const result = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus laporan barang ini?"
    );
    if (result.isConfirmed) {
      dispatch(asyncSetIsLostFoundDelete(id));
    }
  }

  function handleToggleComplete(item) {
    const nextCompleted = item.is_completed ? 0 : 1;
    dispatch(
      asyncSetIsLostFoundChange(item.id, {
        title: item.title,
        description: item.description,
        status: item.status,
        is_completed: nextCompleted,
      })
    );
  }

  const itemList = Array.isArray(lostFounds) ? lostFounds : [];
  const filteredItems = itemList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = item.title ? item.title.toLowerCase() : "";
    const description = item.description ? item.description.toLowerCase() : "";
    return title.includes(q) || description.includes(q);
  });

  const totalCount = itemList.length;
  const lostCount = itemList.filter((t) => t.status === "lost").length;
  const foundCount = itemList.filter((t) => t.status === "found").length;
  const completedCount = itemList.filter((t) => t.is_completed).length;

  const statsRows = transformStatsData(lostFoundStats);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Daftar Barang Hilang & Ditemukan
          </h1>
          <p className="text-sm text-slate-700 mt-1">
            Laporkan, pantau, dan temukan kembali barang hilang di lingkungan kampus.
          </p>
        </div>
        <button
          type="button"
          data-testid="add-lost-found-btn"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all self-start sm:self-auto"
        >
          <IconPlus size={18} stroke={2.5} />
          <span>Tambah Laporan</span>
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Total Barang
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
              {totalCount}
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <IconChecklist size={24} stroke={2} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Barang Hilang
            </p>
            <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
              {lostCount}
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <IconAlertCircle size={24} stroke={2} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Ditemukan
            </p>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
              {foundCount}
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <IconMapPin size={24} stroke={2} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Selesai
            </p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              {completedCount}
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IconCircleCheck size={24} stroke={2} />
          </div>
        </div>
      </div>

      {/* Main List Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <IconSearch
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
            />
            <input
              type="text"
              id="search-lost-found-input"
              data-testid="search-lost-found-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul barang atau deskripsi..."
              aria-label="Cari laporan"
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Jenis */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="status-filter-select" className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                <IconFilter size={15} /> Jenis:
              </label>
              <select
                id="status-filter-select"
                data-testid="status-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter jenis laporan"
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Semua Status</option>
                <option value="lost">Hilang</option>
                <option value="found">Ditemukan</option>
              </select>
            </div>

            {/* Filter Selesai */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="completed-filter-select" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Kondisi:
              </label>
              <select
                id="completed-filter-select"
                data-testid="completed-filter-select"
                value={completedFilter}
                onChange={(e) => setCompletedFilter(e.target.value)}
                aria-label="Filter kondisi laporan"
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Semua Kondisi</option>
                <option value="0">Proses</option>
                <option value="1">Selesai</option>
              </select>
            </div>

            {/* Toggle Laporan Saya */}
            <button
              type="button"
              data-testid="filter-my-items-btn"
              onClick={() => setIsMeFilter((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isMeFilter
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              Laporan Saya
            </button>
          </div>
        </div>

        {/* Grid Card List */}
        <div className="p-6">
          {loadingItems && filteredItems.length === 0 ? (
            <div className="py-16 text-center text-slate-600">
              <IconLoader2 size={36} className="mx-auto text-indigo-600 animate-spin mb-2" />
              <p className="font-medium text-slate-700">Memuat daftar barang...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center text-slate-600">
              <IconChecklist size={44} className="mx-auto text-slate-400 mb-2" />
              <p className="font-semibold text-slate-700">Belum ada barang ditemukan.</p>
              <p className="text-xs text-slate-600 mt-1">Coba sesuaikan pencarian atau kata kunci filter Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const isOwner = profile?.id === item.user_id;
                return (
                  <div
                    key={`item-${item.id}`}
                    data-testid={`lost-found-card-${item.id}`}
                    className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image cover or placeholder banner */}
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        {item.cover ? (
                          <img
                            src={getImageUrl(item.cover)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-600">
                            <IconSearch size={32} stroke={1.5} />
                            <span className="text-xs mt-1 font-medium">Tanpa Cover</span>
                          </div>
                        )}

                        {/* Status badge overlay */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          {item.status === "lost" ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-xs">
                              Hilang
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-700 text-white shadow-xs">
                              Ditemukan
                            </span>
                          )}

                          {item.is_completed ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-700 text-white shadow-xs">
                              Selesai
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800/80 text-white backdrop-blur-xs">
                              Proses
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span className="font-mono font-bold text-indigo-600">#{item.id}</span>
                          <span className="flex items-center gap-1">
                            <IconClock size={13} />
                            {formatDate(item.created_at)}
                          </span>
                        </div>

                        <h2 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h2>

                        <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="pt-2 flex items-center gap-2 text-xs text-slate-700 border-t border-slate-100">
                          <IconUser size={14} className="text-slate-600 shrink-0" />
                          <span className="truncate">
                            Pelapor: <strong className="text-slate-800">{item.author?.name || "Anonim"}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        data-testid={`view-item-${item.id}`}
                        onClick={() => navigate(`/lost-founds/${item.id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                      >
                        <IconEye size={16} />
                        <span>Detail</span>
                      </button>

                      {isOwner && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            data-testid={`toggle-complete-${item.id}`}
                            onClick={() => handleToggleComplete(item)}
                            className={`p-1.5 rounded-lg transition-colors text-xs font-semibold ${
                              item.is_completed
                                ? "text-amber-700 hover:bg-amber-50"
                                : "text-emerald-700 hover:bg-emerald-50"
                            }`}
                            title={item.is_completed ? "Tandai Proses" : "Tandai Selesai"}
                          >
                            <IconCircleCheck size={18} />
                          </button>
                          <button
                            type="button"
                            data-testid={`edit-item-${item.id}`}
                            onClick={() => {
                              setSelectedItemId(item.id);
                              setShowChangeModal(true);
                            }}
                            className="p-1.5 text-slate-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Ubah"
                          >
                            <IconPencil size={18} />
                          </button>
                          <button
                            type="button"
                            data-testid={`delete-item-${item.id}`}
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <IconTrash size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Section Statistik Harian / Bulanan */}
      <div id="statistik" data-testid="stats-section" className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <IconChartBar size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Statistik Laporan</h2>
              <p className="text-xs text-slate-700">Ringkasan statistik barang hilang vs ditemukan.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="stats-daily-btn"
              onClick={() => setStatsType("daily")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statsType === "daily"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Harian
            </button>
            <button
              type="button"
              data-testid="stats-monthly-btn"
              onClick={() => setStatsType("monthly")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statsType === "monthly"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Bulanan
            </button>
          </div>
        </div>

        {statsRows.length === 0 ? (
          <p className="text-center py-8 text-sm text-slate-600">
            Belum ada data statistik tersedia.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider font-semibold text-slate-700 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Periode</th>
                  <th className="px-4 py-3 text-rose-600">Barang Hilang</th>
                  <th className="px-4 py-3 text-amber-600">Barang Ditemukan</th>
                  <th className="px-4 py-3 text-slate-800">Total Laporan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {statsRows.map((row) => (
                  <tr key={`stat-${row.label}`} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-800">{row.label}</td>
                    <td className="px-4 py-3 font-bold text-rose-600">{row.lost}</td>
                    <td className="px-4 py-3 font-bold text-amber-600">{row.found}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{row.lost + row.found}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddModal show={showAddModal} onClose={() => setShowAddModal(false)} />
      <ChangeModal
        show={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        lostFoundId={selectedItemId}
      />
    </div>
  );
}

export default HomePage;
