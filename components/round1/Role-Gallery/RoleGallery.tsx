'use client';

import {
  Layers,
  Bookmark,
  BookMarked,
  ArrowRight,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import { updateUserStatus } from '@/lib/apiUtil';
import axios from 'axios';

type Role = {
  _id: string;
  roleTitle: string;
  roleDescription: string;
  roleIconUrl: string;
  isRoleActive: boolean;
};

export default function RoleGallerySection() {
  const [roles, setRoles] = useState<Role[]>([]);
  // const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeCard, setActiveCard] = useState<Role | null>(null);
  const { data: session, update } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('/api/v1/round/1/roles');
        setRoles(response.data.roles);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  // const toggleBookmark = (id: string) => {
  //   setBookmarkedIds((prev) =>
  //     prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  //   );
  // };

  const initiateRound1 = async (userId: string, roleId: string) => {
    try {
      const response = await axios.post('/api/v1/round/1/attempt', {
        userId,
        roleId,
      }, {
        validateStatus: (status) => { return status < 500 }
      });

      if(response.status == 409) {
        return response.data.attemptId
      }

      if (response.status !== 200) {
        showToast('error', 'Failed to start round', 3000);
        return null;
      }

      return response.data.attemptId;
    } catch {
      showToast('error', 'Failed to start round', 3000);
      return null;
    }
  };

  const handleStartRound = async (roleId: string) => {
    if (!session) {
      showToast('error', 'Please log in to start', 3000);
      return;
    }

    const userId = session.user.uid;
    showToast('loading', 'Initiating Round 1', 3000);

    const statusUpdated = await updateUserStatus(userId, 'ROUND_1', update);
    if (!statusUpdated) return;

    const attemptId = await initiateRound1(userId, roleId);
    if (!attemptId) return;

    router.push(`/round/1?id=${attemptId}`);
  };

  const handleLoadMore = () => {
    setVisibleCount(roles.length);
  };

  return (
    <section className="w-full mb-12 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24">
        {/* Heading + Search */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="text-blue-500" />
            <span className="text-lg font-semibold text-gray-900">
              Explore Roles
            </span>
          </div>
          {/* <div className="flex items-center gap-3">
            <input
              placeholder="Search roles, skills, backgrounds..."
              className="rounded-full px-4 py-2 border border-gray-200 text-sm w-full sm:w-64 focus:outline-none focus:border-indigo-400 transition"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="relative group flex items-center gap-1 px-3 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-sm transition"
            >
              <Bookmark className="w-4 h-4" />
              Bookmarks
              {bookmarkedIds.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                  {bookmarkedIds.length}
                </span>
              )}
            </motion.button>
          </div> */}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {roles.slice(0, visibleCount).map((role, index) => (
            <motion.div
              key={role._id}
              className="bg-gray-50 rounded-2xl p-6 shadow-lg hover:-translate-y-2 hover:shadow-xl relative cursor-pointer transition-transform duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              onClick={() => setActiveCard(role)}
            >
              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(role._id);
                }}
                className={`absolute right-6 top-6 z-10 ${
                  bookmarkedIds.includes(role._id)
                    ? 'text-indigo-500'
                    : 'text-gray-400 hover:text-indigo-500'
                } transition`}
              >
                {bookmarkedIds.includes(role._id) ? (
                  <BookMarked className="w-5 h-5" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button> */}
              <div className="mb-4">
                <img
                  src={role.roleIconUrl || '/default.png'}
                  alt={role.roleTitle}
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {role.roleTitle}
              </h3>
              {/* <p className="text-sm text-gray-700 mb-4">
                {role.roleDescription.split(' ').slice(0, 6).join(' ')}...
              </p> */}

              {/* <span className="inline-flex">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartRound(role._id);
                  }}
                  className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold text-sm shadow hover:bg-blue-700 transition"
                >
                  Start Round 1
                </motion.button>
              </span> */}
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {visibleCount < roles.length && (
          <div className="flex justify-center mt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleLoadMore}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition"
            >
              <Bookmark className="w-4 h-4" />
              Load More Roles
            </motion.button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeCard && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCard(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-xl mx-4 bg-white rounded-2xl shadow-xl p-6 relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setActiveCard(null)}
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={activeCard.roleIconUrl || '/default.png'}
                  alt={activeCard.roleTitle}
                  className="w-full h-56 object-cover rounded-xl mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {activeCard.roleTitle}
                </h2>
                <p className="text-gray-700 text-sm">
                  {activeCard.roleDescription}
                </p>
                <div className="mt-6 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleStartRound(activeCard._id)}
                    className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold text-sm shadow hover:bg-blue-700 transition"
                  >
                    Start Round 1
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}