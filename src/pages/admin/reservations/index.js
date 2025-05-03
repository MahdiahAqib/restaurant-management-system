import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../../../styles/AdminReservation.module.css'; 

export default function AdminReservations() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations');
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchReservations();
    }
  }, [status]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setReservations(reservations.map(res =>
          res._id === id ? { ...res, status: newStatus } : res
        ));

        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: newStatus === 'cancelled' ? 'reservation_cancelled' : 'reservation_updated',
            reservationId: id,
          }),
        });
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="p-8 text-center text-lg text-white">Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className="text-3xl font-bold">Reservations Management</h1>
        <button
          onClick={() => {
            setSelectedReservation(null);
            setIsModalOpen(true);
          }}
          className={styles.button}
        >
          <Plus size={20} />
          New Reservation
        </button>
      </div>

      <div className={styles.table}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-white" />
          <h2 className="text-xl font-semibold">Reservation Calendar</h2>
        </div>
        {/* Calendar goes here */}
      </div>

      <div className={styles.table}>
        <h2 className="text-xl font-semibold mb-4">All Reservations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                {['name', 'Date & Time', 'Table Number', 'Guests', 'Status', 'Actions'].map((head) => (
                  <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {reservations.map((res) => (
                <tr key={res._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{res.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{new Date(res.dateTime).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{res.tableNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{res.guests}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={res.status}
                      onChange={(e) => handleStatusChange(res._id, e.target.value)}
                      className={`${styles.select} ${
                        res.status === 'confirmed' ? 'bg-green-800 text-green-200' :
                        res.status === 'pending' ? 'bg-yellow-800 text-yellow-200' :
                        'bg-red-800 text-red-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedReservation(res);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-400 hover:text-blue-600 mr-4"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleStatusChange(res._id, 'cancelled')}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className="text-xl font-semibold mb-4">
              {selectedReservation ? 'Edit Reservation' : 'New Reservation'}
            </h2>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = {
                  name: e.target.name.value,
                  dateTime: new Date(e.target.dateTime.value),
                  tableNumber: e.target.tableNumber.value,
                  guests: e.target.guests.value,
                  email: e.target.email.value,
                  phone: e.target.phone.value,
                  status: e.target.status.value || 'pending',
                };
                try {
                  const response = await fetch(
                    selectedReservation
                      ? `/api/reservations/${selectedReservation._id}`
                      : `/api/reservations`,
                    {
                      method: selectedReservation ? 'PUT' : 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(formData),
                    }
                  );
                  if (!response.ok) throw new Error('Failed to submit reservation');
                  await fetchReservations();
                  setIsModalOpen(false);
                } catch (error) {
                  console.error(error);
                  alert('Error submitting reservation');
                }
              }}
            >
              {['name', 'dateTime', 'tableNumber', 'guests', 'email', 'phone'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium capitalize text-gray-300">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    name={field}
                    type={field === 'dateTime' ? 'datetime-local' : field === 'email' ? 'email' : 'text'}
                    defaultValue={
                      field === 'dateTime'
                        ? selectedReservation?.dateTime?.slice(0, 16)
                        : selectedReservation?.[field]
                    }
                    className={styles.input}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-300">Status</label>
                <select
                  name="status"
                  defaultValue={selectedReservation?.status || 'pending'}
                  className={styles.select}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  {selectedReservation ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
