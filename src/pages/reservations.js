import { useState } from 'react';
import { Calendar, Users, Clock } from 'lucide-react';

export default function Reservations() {
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

  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...customerInfo,
          dateTime: new Date(`${selectedDate}T${selectedTime}`),
          guests,
          tableNumber: 1, // This will be replaced with actual table selection later
        }),
      });

      if (response.ok) {
        setMessage('Reservation created successfully!');
        setShowConfirmation(true);
      } else {
        setMessage('Error creating reservation. Please try again.');
      }
    } catch (error) {
      setMessage('Error creating reservation. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Make a Reservation</h1>

      {message && (
        <div className="mb-4 p-4 rounded-md bg-green-100 text-green-700">
          {message}
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time
            </label>
            <div className="grid grid-cols-5 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-3 rounded-md text-sm ${
                    selectedTime === time
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                -
              </button>
              <span className="text-lg font-medium">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests(Math.min(10, guests + 1))}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, email: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, phone: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Make Reservation
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Reservation Confirmed!</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span>{selectedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span>{selectedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>{guests} guests</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  // Reset form
                  setSelectedDate('');
                  setSelectedTime('');
                  setGuests(2);
                  setCustomerInfo({ name: '', email: '', phone: '' });
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 