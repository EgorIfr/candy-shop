import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function AdminPanel() {
  const { user, isAdmin, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    image: null
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isAdmin()) {
      navigate('/');
      return;
    }

    fetchProducts();
  }, [user, isAdmin, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка при удалении товара');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Ошибка при удалении товара');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.price) {
      setError('Название и цена обязательны');
      return;
    }

    try {
      const token = getToken();
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      if (formData.category_id) {
        formDataToSend.append('category_id', formData.category_id);
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const newProduct = await response.json();
        await fetchProducts(); // Обновляем список товаров
        setFormData({
          title: '',
          description: '',
          price: '',
          category_id: '',
          image: null
        });
        setShowAddForm(false);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Ошибка при создании товара');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setError('Ошибка при создании товара');
    }
  };

  if (loading) {
    return <div className="admin-container">Загрузка...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Панель администратора</h1>
        <a href="/"><h4>Вернутся назад</h4></a>
        <div className="admin-header-actions">
          <span>Добро пожаловать, {user?.username}</span>
          <button onClick={logout} className="logout-button">Выйти</button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-actions">
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="add-product-button"
          >
            {showAddForm ? 'Отменить' : '+ Добавить товар'}
          </button>
        </div>

        {showAddForm && (
          <div className="add-product-form">
            <h2>Добавить новый товар</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Цена *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>ID категории</label>
                <input
                  type="number"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Изображение</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit" className="submit-button">Создать товар</button>
            </form>
          </div>
        )}

        <div className="products-list">
          <h2>Список товаров ({products.length})</h2>
          {products.length === 0 ? (
            <p>Товаров пока нет</p>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  {product.image_url && (
                    <img 
                      src={`${API_URL}${product.image_url}`} 
                      alt={product.title}
                      className="product-image"
                    />
                  )}
                  <div className="product-info">
                    <h3>{product.title}</h3>
                    <p className="product-price">{product.price} ₽</p>
                    {product.description && (
                      <p className="product-description">{product.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="delete-button"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

