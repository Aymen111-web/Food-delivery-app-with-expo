
// Colors and global styles
export const Colors = {
    primary: '#FF6B6B', // Vibrant food app red/coral
    secondary: '#4ECDC4', // Fresh teal
    background: '#F7F7F7',
    card: '#FFFFFF',
    text: '#2D3436',
    textLight: '#A4B0BE',
    border: '#DFE6E9',
    success: '#2ECC71',
    error: '#FF5252',
    warning: '#FFA502',
};

// Mock Data
export const MOCK_RESTAURANTS = [
    {
        id: '1',
        name: 'Burger Bistro',
        rating: 4.8,
        categories: ['Burgers', 'American'],
        deliveryTime: '20-30 min',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
        menu: [
            { id: '101', name: 'Classic Cheeseburger', price: 12.99, description: 'Angus beef, cheddar, lettuce, tomato', category: 'Burgers' },
            { id: '102', name: 'Bacon Deluxe', price: 14.99, description: 'Smoked bacon, bbq sauce, onion rings', category: 'Burgers' },
        ]
    },
    {
        id: '2',
        name: 'Sushi Zen',
        rating: 4.9,
        categories: ['Japanese', 'Sushi'],
        deliveryTime: '35-45 min',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',
        menu: [
            { id: '201', name: 'Dragon Roll', price: 16.50, description: 'Eel, cucumber, avocado', category: 'Sushi' },
            { id: '202', name: 'Spicy Tuna', price: 10.00, description: 'Fresh tuna, spicy mayo', category: 'Sushi' },
        ]
    },
    {
        id: '3',
        name: 'Pizza Paradiso',
        rating: 4.5,
        categories: ['Italian', 'Pizza'],
        deliveryTime: '25-40 min',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',
        menu: [
            { id: '301', name: 'Margherita', price: 11.99, description: 'Tomato, mozzarella, basil', category: 'Pizza' },
            { id: '302', name: 'Pepperoni Feast', price: 14.99, description: 'Double pepperoni, extra cheese', category: 'Pizza' },
        ]
    }
];

export const MOCK_CATEGORIES = [
    { id: '1', name: 'Burgers', icon: 'hamburger' },
    { id: '2', name: 'Pizza', icon: 'pizza-slice' },
    { id: '3', name: 'Sushi', icon: 'fish' },
    { id: '4', name: 'Desserts', icon: 'ice-cream' },
];
