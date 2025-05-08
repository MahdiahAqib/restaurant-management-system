import { useState, useEffect } from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import styles from '../styles/Reservations.module.css';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import UserLayout from '../components/UserLayout';

export default function Reservations() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (!userCookie) {
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(userCookie);
      setUserData(user);
      // Pre-fill customer info if available
      setCustomerInfo(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    } catch (err) {
      console.error('Failed to parse user cookie', err);
      router.push('/login');
    }
  }, [router]);

  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) {
      setMessage('Please log in to make a reservation');
      return;
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...customerInfo,
          dateTime: new Date(`${selectedDate}T${selectedTime}`),
          guests,
          tableNumber: 1,
          userId: userData._id || userData.id, // Use _id if available, otherwise use id
        }),
      });

      if (response.ok) {
        setMessage('Reservation created successfully!');
        setShowConfirmation(true);
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error creating reservation. Please try again.');
      }
    } catch (error) {
      setMessage('Error creating reservation. Please try again.');
    }
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Make a Reservation</h1>

        {message && <div className={styles.message}>{message}</div>}

        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Date */}
            <div>
              <label className={styles.label}>Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className={styles.label}>Select Time</label>
              <div className={styles.timeGrid}>
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`${styles.timeButton} ${
                      selectedTime === time ? styles.activeTime : ''
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className={styles.label}>Number of Guests</label>
              <div className={styles.guestControl}>
                <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))}>-</button>
                <span>{guests}</span>
                <button type="button" onClick={() => setGuests(Math.min(10, guests + 1))}>+</button>
              </div>
            </div>

            {/* Customer Info */}
            <div className={styles.customerInfo}>
              <div>
                <label className={styles.label}>Name</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>
              <div>
                <label className={styles.label}>Phone</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.submitWrapper}>
              <button type="submit" className={styles.submitButton}>
                Make Reservation
              </button>
            </div>
          </form>
        </div>

        {showConfirmation && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>Reservation Confirmed!</h2>
              <div className={styles.confirmDetails}>
                <div><Calendar size={20} /> <span>{selectedDate}</span></div>
                <div><Clock size={20} /> <span>{selectedTime}</span></div>
                <div><Users size={20} /> <span>{guests} guests</span></div>
              </div>
              <div className={styles.modalActions}>
                <button
                  className={styles.closeButton}
                  onClick={() => {
                    setShowConfirmation(false);
                    setSelectedDate('');
                    setSelectedTime('');
                    setGuests(2);
                    setCustomerInfo({ name: '', email: '', phone: '' });
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
