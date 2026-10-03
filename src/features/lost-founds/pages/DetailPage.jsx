import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  asyncSetLostFound,
  asyncSetIsLostFoundDelete,
  setIsLostFoundActionCreator,
  setIsLostFoundDeleteActionCreator,
} from "../states/action";
import {
  formatDate,
  getImageUrl,
  showConfirmDialog,
} from "../../../helpers/toolsHelper";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import ChangeModal from "../modals/ChangeModal";
import {
  IconArrowLeft,
  IconPhotoUp,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconCircleCheck,
  IconClock,
  IconAlertCircle,
  IconMapPin,
  IconLoader2,
} from "@tabler/icons-react";

function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile);
  const lostFound = useSelector((state) => state.lostFound);
  const isLostFound = useSelector((state) => state.isLostFound);
  const isLostFoundDeleted = useSelector((state) => state.isLostFoundDeleted);

  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(asyncSetLostFound(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (isLostFound) {
      dispatch(setIsLostFoundActionCreator(false));
      if (!lostFound) {
        navigate("/");
      }
    }
  }, [isLostFound, lostFound, navigate, dispatch]);

  useEffect(() => {
    if (isLostFoundDeleted) {
      dispatch(setIsLostFoundDeleteActionCreator(false));
      navigate("/");
    }
  }, [isLostFoundDeleted, navigate, dispatch]);

  if (!profile || !lostFound) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <IconLoader2 size={36} className="text-indigo-600 animate-spin mb-2" />
        <p className="text-sm font-medium text-slate-700">Memuat detail barang...</p>
      </div>
    );
  }

  const isOwner = profile.id === lostFound.user_id;

  async function handleDelete() {
    const result = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus laporan ini?"
    );
    if (result.isConfirmed) {
      dispatch(asyncSetIsLostFoundDelete(lostFound.id));
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/"
          data-testid="back-to-home-link"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
        >
          <IconArrowLeft size={18} />
          Kembali ke Dashboard
        </Link>

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="edit-cover-btn"
              onClick={() => setShowCoverModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 transition-colors"
            >
              <IconPhotoUp size={16} />
              Ubah Cover
            </button>
            <button
              type="button"
              data-testid="edit-detail-btn"
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors"
            >
              <IconEdit size={16} />
              Ubah Data
            </button>
            <button
              type="button"
              data-testid="delete-detail-btn"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-colors"
            >
              <IconTrash size={16} />
              Hapus
            </button>
          </div>
        )}
      </div>

      {/* Main Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {lostFound.cover && (
          <div className="relative w-full h-64 sm:h-96 bg-slate-900 overflow-hidden">
            <img
              src={getImageUrl(lostFound.cover)}
              alt={lostFound.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-slate-600">
                #{lostFound.id}
              </span>

              {lostFound.status === "lost" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <IconAlertCircle size={14} />
                  Barang Hilang
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <IconMapPin size={14} />
                  Barang Ditemukan
                </span>
              )}

              {lostFound.is_completed ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <IconCircleCheck size={14} />
                  Selesai
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  <IconClock size={14} />
                  Sedang Proses
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {lostFound.title}
            </h1>

            {/* Reporter & Dates */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {lostFound.author?.photo ? (
                  <img
                    src={getImageUrl(lostFound.author.photo)}
                    alt={lostFound.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
                    {lostFound.author?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-600">Dilaporkan Oleh</p>
                  <p className="text-sm font-bold text-slate-800">
                    {lostFound.author?.name || "Pengguna Anonim"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <IconCalendar size={14} className="shrink-0" />
                  <span>
                    Tanggal Lapor:{" "}
                    <strong className="text-slate-700">
                      {formatDate(lostFound.created_at)}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Deskripsi Laporan
            </h2>
            <div className="prose max-w-none text-slate-700 bg-slate-50/70 p-6 rounded-2xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
              {lostFound.description || "Tidak ada deskripsi rincian untuk barang ini."}
            </div>
          </div>
        </div>
      </div>

      {/* Cover Modal */}
      {isOwner && (
        <ChangeCoverModal
          show={showCoverModal}
          onClose={() => setShowCoverModal(false)}
          lostFound={lostFound}
        />
      )}

      {/* Edit Modal */}
      {isOwner && (
        <ChangeModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          lostFoundId={lostFound.id}
        />
      )}
    </div>
  );
}

export default DetailPage;
