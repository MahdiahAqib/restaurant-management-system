import React, { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../../../components/AdminLayout";
import styles from "../../../styles/Customers.module.css";
import { FiTrash2, FiEye, FiSearch } from "react-icons/fi";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import CustomerDetailsModal from "../../../components/CustomerDetailsModal";
import { requireAdminAuth } from "../../../lib/auth";

export const getServerSideProps = requireAdminAuth();

const CustomersPage = (session) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers");
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter((customer) =>
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const fetchCustomerOrders = async (userId) => {
    try {
      const response = await fetch(
        `/api/orders/customer?userId=${userId}&limit=3`
      );
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching orders:", err);
      return [];
    }
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/customers/${customerToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete customer");

      setCustomers(customers.filter((c) => c._id !== customerToDelete._id));
      setFilteredCustomers(
        filteredCustomers.filter((c) => c._id !== customerToDelete._id)
      );
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewDetails = async (customer) => {
    setSelectedCustomer(customer);
    const orders = await fetchCustomerOrders(customer._id);
    setCustomerOrders(orders);
    setShowDetailsModal(true);
  };

  if (loading)
    return <div className={styles.loading}>Loading customers...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <>
      <Head>
        <title>Customers | Restaurant Admin</title>
      </Head>

      <div className={styles.header}>
        <h1>Customers</h1>
        <div className={styles.searchFilterContainer}>
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleViewDetails(customer)}
                    >
                      <FiEye />
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleDeleteClick(customer)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && !loading && (
          <div className={styles.noResults}>
            {searchTerm
              ? "No customers found matching your search"
              : "No customers found"}
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={customerToDelete?.name || "this customer"}
        itemType="customer"
      />

      <CustomerDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        customer={selectedCustomer}
        orders={customerOrders}
      />
    </>
  );
};

CustomersPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
export default CustomersPage;
