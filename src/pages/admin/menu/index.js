import { useState, useEffect } from "react";
import axios from "axios";
import styles from '../../../styles/menu.module.css';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: ""
  });
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("/api/menu");
        setMenuItems(response.data);
        const itemCategories = [...new Set(response.data.map(item => item.category))];
        setCategories(itemCategories);
        if (itemCategories.length > 0 && !activeCategory) {
          setActiveCategory(itemCategories[0]);
          setFormData(prev => ({ ...prev, category: itemCategories[0] }));
        }
      } catch (error) {
        showNotification(error.response?.data?.error || error.message, 'error');
      }
    };
    fetchMenuItems();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      showNotification("Name, price and category are required", 'error');
      return;
    }
    try {
      const method = formData._id ? "put" : "post";
      const url = formData._id ? `/api/menu?id=${formData._id}` : "/api/menu";
      await axios[method](url, { ...formData, price: Number(formData.price) });
      showNotification(`Item ${formData._id ? "updated" : "added"} successfully`, 'success');
      const response = await axios.get("/api/menu");
      setMenuItems(response.data);
      resetForm();
    } catch (error) {
      showNotification(error.response?.data?.error || error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`/api/menu?id=${id}`);
      showNotification("Item deleted successfully", 'success');
      const response = await axios.get("/api/menu");
      setMenuItems(response.data);
    } catch (error) {
      showNotification(error.response?.data?.error || error.message, 'error');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      _id: item._id,
      name: item.name,
      price: item.price.toString(),
      description: item.description || "",
      category: item.category,
      image: item.image || ""
    });
    setIsAddingItem(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      category: activeCategory || "",
      image: ""
    });
    setIsAddingItem(false);
  };

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  return (
    <div className={styles.menuContainer}>
      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${
          notification.type === 'success' ? styles.notificationSuccess : styles.notificationError
        }`}>
          {notification.message}
          <button 
            className={styles.notificationClose} 
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.flexContainer}>
        {/* Categories Sidebar */}
        <div className={styles.categoriesSidebar}>
          <h2 className={styles.categoryTitle}>Categories</h2>
          <div>
            {categories.map(category => (
              <div
                key={category}
                className={`${styles.categoryItem} ${activeCategory === category ? styles.categoryItemActive : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.menuContent}>
          <h2 className={styles.sectionTitle}>Choose Dishes</h2>
          
          {isAddingItem ? (
            <div className={styles.menuItem}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Item name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${styles.formTextarea}`}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.imageUpload}>
                  <label>Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className={styles.itemImage} 
                    />
                  )}
                </div>
                
                <div className={styles.buttonGroup}>
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className={`${styles.button} ${styles.secondaryButton}`}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className={`${styles.button} ${styles.primaryButton}`}
                  >
                    {formData._id ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {filteredItems.map(item => (
                <div key={item._id} className={styles.menuItem}>
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className={styles.itemImage} 
                    />
                  )}
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDescription}>{item.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.itemPrice}>${item.price}</span>
                    <div className={styles.buttonGroup}>
                      <button 
                        onClick={() => handleEdit(item)}
                        className={`${styles.button} ${styles.secondaryButton}`}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className={`${styles.button} ${styles.primaryButton}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => setIsAddingItem(true)}
                className={`${styles.button} ${styles.primaryButton}`}
                style={{ marginTop: '20px' }}
              >
                Add New Item
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;