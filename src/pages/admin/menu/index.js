import { useState, useEffect } from "react";
import axios from "axios";
import styles from '../../../styles/menu.module.css';
import { requireAdminAuth } from "../../../lib/auth";
// Icons (you can use react-icons or similar)
const CloseIcon = () => <span>×</span>;
const AddIcon = () => <span>+</span>;
const EditIcon = () => <span>✎</span>;
const DeleteIcon = () => <span>🗑</span>;
const SuccessIcon = () => <span>✓</span>;
const ErrorIcon = () => <span>!</span>;
export const getServerSideProps = requireAdminAuth();  

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
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, categoriesResponse] = await Promise.all([
          axios.get("/api/menu"),
          axios.get("/api/menu?getCategories=true")
        ]);
        
        setMenuItems(itemsResponse.data);
        setCategories(categoriesResponse.data);
        
        if (categoriesResponse.data.length > 0 && !activeCategory) {
          const firstCategory = categoriesResponse.data[0];
          setActiveCategory(firstCategory);
          setFormData(prev => ({ ...prev, category: firstCategory }));
        }
      } catch (error) {
        showNotification(error.response?.data?.error || error.message, 'error');
      }
    };
    fetchData();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
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
      
      const response = await axios[method](url, { 
        ...formData, 
        price: Number(formData.price) 
      });
      
      showNotification(
        `Item ${formData._id ? "updated" : "added"} successfully`, 
        'success'
      );
      
      // Refresh data
      const [itemsResponse, categoriesResponse] = await Promise.all([
        axios.get("/api/menu"),
        axios.get("/api/menu?getCategories=true")
      ]);
      
      setMenuItems(itemsResponse.data);
      setCategories(categoriesResponse.data);
      resetForm();
      setIsNewCategory(false); // Reset the new category flag
    } catch (error) {
      showNotification(error.response?.data?.error || error.message, 'error');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`/api/menu?id=${id}`);
      showNotification("Item deleted successfully", 'success');
      
      // Refresh data
      const [itemsResponse, categoriesResponse] = await Promise.all([
        axios.get("/api/menu"),
        axios.get("/api/menu?getCategories=true")
      ]);
      
      setMenuItems(itemsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      showNotification(error.response?.data?.error || error.message, 'error');
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Are you sure you want to delete the "${category}" category and all its items?`)) return;
    try {
      await axios.delete(`/api/menu?category=${encodeURIComponent(category)}`);
      showNotification(`Category "${category}" deleted successfully`, 'success');
      
      // Refresh data
      const [itemsResponse, categoriesResponse] = await Promise.all([
        axios.get("/api/menu"),
        axios.get("/api/menu?getCategories=true")
      ]);
      
      setMenuItems(itemsResponse.data);
      const updatedCategories = categoriesResponse.data;
      setCategories(updatedCategories);
      
      // Reset active category if it was deleted
      if (activeCategory === category) {
        const newActiveCategory = updatedCategories[0] || "";
        setActiveCategory(newActiveCategory);
        setFormData(prev => ({ ...prev, category: newActiveCategory }));
      }
    } catch (error) {
      showNotification(error.response?.data?.error || error.message, 'error');
    }
  };

  const handleEditItem = (item) => {
    setFormData({
      _id: item._id,
      name: item.name,
      price: item.price.toString(),
      description: item.description || "",
      category: item.category,
      image: item.image || ""
    });
    setIsAddingItem(true);
    setIsNewCategory(false); // Ensure this is false when editing
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
    setIsNewCategory(false);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      showNotification("Category name cannot be empty", 'error');
      return;
    }
    
    try {
      // Create the new category
      await axios.post("/api/menu", {
        action: "createCategory",
        categoryName: newCategoryName.trim()
      });
      
      showNotification(`Category "${newCategoryName}" created successfully`, 'success');
      
      // Refresh both menu items and categories
      const [itemsResponse, categoriesResponse] = await Promise.all([
        axios.get("/api/menu"),
        axios.get("/api/menu?getCategories=true")
      ]);
      
      setMenuItems(itemsResponse.data);
      const updatedCategories = categoriesResponse.data;
      setCategories(updatedCategories);
      
      // Close the modal and reset the input
      setNewCategoryName("");
      setShowCategoryModal(false);
      
      // Set the new category as active
      const newCategory = newCategoryName.trim();
      setActiveCategory(newCategory);
      
      // Update form data to include the new category and set the flag
      setFormData(prev => ({
        ...prev,
        category: newCategory
      }));
      setIsNewCategory(true);
      setIsAddingItem(true);
      
    } catch (error) {
      showNotification(error.response?.data?.error || error.message, 'error');
    }
  };

  const filteredItems = activeCategory 
    ? menuItems.filter(item => item.category === activeCategory)
    : [];

  return (
    <div className={styles.menuContainer}>
      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${
          notification.type === 'success' ? styles.notificationSuccess :
          notification.type === 'error' ? styles.notificationError :
          styles.notificationWarning
        }`}>
          <span className={styles.notificationIcon}>
            {notification.type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
          </span>
          {notification.message}
          <button 
            className={styles.notificationClose} 
            onClick={() => setNotification(null)}
          >
            <CloseIcon />
          </button>
        </div>
      )}

      {/* Category Creation Modal */}
      {showCategoryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Create New Category</h3>
              <button 
                className={styles.modalClose}
                onClick={() => setShowCategoryModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category Name</label>
              <input
                type="text"
                className={styles.formInput}
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                autoFocus
              />
            </div>
            
            <div className={styles.buttonGroup}>
              <button 
                className={`${styles.button} ${styles.secondaryButton}`}
                onClick={() => setShowCategoryModal(false)}
              >
                Cancel
              </button>
              <button 
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={handleCreateCategory}
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.flexContainer}>
        {/* Categories Sidebar */}
        <div className={styles.categoriesSidebar}>
          <h2 className={styles.categoryTitle}>
            Categories
            <button 
              className={styles.button}
              onClick={() => setShowCategoryModal(true)}
              style={{ padding: '5px 10px', fontSize: '0.9rem' }}
            >
              <AddIcon /> New
            </button>
          </h2>
          
          {categories.length === 0 ? (
            <p className={styles.textMuted}>No categories found</p>
          ) : (
            <div>
              {categories.map(category => (
                <div
                  key={category}
                  className={`${styles.categoryItem} ${
                    activeCategory === category ? styles.categoryItemActive : ''
                  }`}
                  onClick={() => {
                    setActiveCategory(category);
                    setFormData(prev => ({ ...prev, category }));
                    setIsNewCategory(false); // Reset when selecting a category
                  }}
                >
                  {category}
                  <div className={styles.categoryActions}>
                    <button 
                      className={styles.categoryActionBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category);
                      }}
                      title="Delete category"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className={styles.menuContent}>
          <h2 className={styles.sectionTitle}>
            {activeCategory || "Select a category"}
            {activeCategory && (
              <button 
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={() => {
                  setIsAddingItem(true);
                  setFormData(prev => ({
                    ...prev,
                    category: activeCategory
                  }));
                  setIsNewCategory(false); // Reset when adding a regular item
                }}
              >
                <AddIcon /> Add Item
              </button>
            )}
          </h2>
          
          {isAddingItem ? (
            <div className={styles.formContainer}>
              <h3 className={styles.formTitle}>
                {formData._id ? "Edit Item" : "Add New Item"}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Item Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter item name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    name="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${styles.formTextarea}`}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  {isNewCategory ? (
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      readOnly
                      className={styles.formInput}
                    />
                  ) : (
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`${styles.formInput} ${styles.formSelect}`}
                      required
                      key={categories.join(',')} // Force re-render when categories change
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.formInput}
                  />
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className={styles.imagePreview} 
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
                    {formData._id ? "Update Item" : "Save Item"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {filteredItems.length === 0 ? (
                <div className={styles.textCenter}>
                  <p className={styles.textMuted}>
                    {activeCategory 
                      ? `No items found in ${activeCategory} category`
                      : "Please select a category"}
                  </p>
                  {activeCategory && (
                    <button 
                      className={`${styles.button} ${styles.primaryButton} ${styles.mt20}`}
                      onClick={() => {
                        setIsAddingItem(true);
                        setFormData(prev => ({
                          ...prev,
                          category: activeCategory
                        }));
                        setIsNewCategory(false);
                      }}
                    >
                      <AddIcon /> Add First Item
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.menuItemsGrid}>
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
                      <div className={styles.itemFooter}>
                        <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                        <div className={styles.buttonGroup}>
                          <button 
                            onClick={() => handleEditItem(item)}
                            className={`${styles.button} ${styles.secondaryButton}`}
                            style={{ padding: '6px 12px' }}
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item._id)}
                            className={`${styles.button} ${styles.dangerButton}`}
                            style={{ padding: '6px 12px' }}
                            title="Delete"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;