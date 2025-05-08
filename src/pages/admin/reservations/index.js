import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../../../styles/AdminReservation.module.css';
import AdminLayout from '../../../components/AdminLayout';

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

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this reservation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        // Remove the deleted reservation from the state
        setReservations(reservations.filter(res => res._id !== id));

        // Create a notification for the deletion
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'reservation_deleted',
            reservationId: id,
          }),
        });
      } else {
        console.error('Delete failed:', data);
        throw new Error(data.error || 'Failed to delete reservation');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert(error.message);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="p-8 text-center text-lg text-white">Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
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
            <table className={styles.reservationTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date & Time</th>
                  <th>Table</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res._id}>
                    <td>
                      <div className={styles.customerInfo}>
                        <span className={styles.customerName}>{res.name}</span>
                        <span className={styles.customerContact}>
                          {res.email} • {res.phone}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.dateTimeInfo}>
                        <span className={styles.date}>
                          {new Date(res.dateTime).toLocaleDateString()}
                        </span>
                        <span className={styles.time}>
                          {new Date(res.dateTime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.tableNumber}>
                        Table {res.tableNumber}
                      </span>
                    </td>
                    <td>
                      <span className={styles.guests}>
                        {res.guests} {res.guests === 1 ? 'Guest' : 'Guests'}
                      </span>
                    </td>
                    <td>
                      <select
                        value={res.status}
                        onChange={(e) => handleStatusChange(res._id, e.target.value)}
                        className={`${styles.statusSelect} ${
                          res.status === 'confirmed' ? styles.statusConfirmed :
                          res.status === 'pending' ? styles.statusPending :
                          styles.statusCancelled
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => {
                            setSelectedReservation(res);
                            setIsModalOpen(true);
                          }}
                          className={styles.editButton}
                          title="Edit Reservation"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(res._id)}
                          className={styles.deleteButton}
                          title="Delete Reservation"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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
                  if (!session?.user) {
                    alert('Please log in to create a reservation');
                    return;
                  }

                  const formData = {
                    name: e.target.name.value,
                    dateTime: new Date(e.target.dateTime.value),
                    tableNumber: e.target.tableNumber.value,
                    guests: e.target.guests.value,
                    email: e.target.email.value,
                    phone: e.target.phone.value,
                    status: e.target.status.value || 'pending',
                    userId: session.user._id || session.user.id,
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

                    const data = await response.json();
                    
                    if (!response.ok) {
                      let errorMessage = 'Failed to submit reservation';
                      if (data.error) {
                        errorMessage = data.error;
                        if (data.details) {
                          if (typeof data.details === 'object') {
                            const missingFields = Object.entries(data.details)
                              .filter(([_, value]) => value !== null)
                              .map(([field]) => field);
                            errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
                          } else {
                            errorMessage += `: ${data.details}`;
                          }
                        }
                      }
                      throw new Error(errorMessage);
                    }

                    await fetchReservations();
                    setIsModalOpen(false);
                  } catch (error) {
                    console.error('Reservation error:', error);
                    alert(error.message);
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
    </AdminLayout>
  );
}
