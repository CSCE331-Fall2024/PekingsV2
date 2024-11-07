// new stuff
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import './DuckMascot.css';

const TAX_RATE = 0.0825;
const INGREDIENT_PRICE = 0.50;
const PROMO_DISCOUNT = 0.20;
const VALID_PROMO_CODES = ['DUCK20', 'PEKINGS20', 'WELCOME20'];

const DuckMascot = forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [orderItems, setOrderItems] = useState([]);
    const [expandedItems, setExpandedItems] = useState({});
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');
    const [ingredientNames, setIngredientNames] = useState({});

    // Fetch ingredient name for a given ID
    const fetchIngredientName = async (id) => {
        try {
            const response = await fetch(`/api/inventory/${id}`);
            if (response.ok) {
                const data = await response.json();
                setIngredientNames(prev => ({
                    ...prev,
                    [id]: data.name
                }));
            }
        } catch (error) {
            console.error(`Error fetching ingredient name for ID ${id}:`, error);
        }
    };

    //gets ingredient id for each ingredient
    useEffect(() => {
        orderItems.forEach(item => {
            if (item.ingredients) {
                item.ingredients.forEach(ingredient => {
                    const ingredientId = ingredient.ingredient || ingredient;
                    if (!ingredientNames[ingredientId]) {
                        fetchIngredientName(ingredientId);
                    }
                });
            }
        });
    }, [orderItems]);

    // function that handles when a menu item is clicked, will add to the order list
    useImperativeHandle(ref, () => ({
        addItem: (item) => {
            try {
                const newItem = {
                    // copies over item property
                    ...item,

                    // id is the current date to track new
                    id: Date.now(),

                    // store the original menu item ID
                    menuItemId: item.id,

                    // copy of ingredients, if not filled in, choose empty list
                    ingredients: (item.ingredients || []).map(ing => ({
                        ...ing,
                        ingredient: ing.ingredient || ing.id || ing
                    })),

                    // update ingredientCounts to use correct IDs
                    ingredientCounts: Object.fromEntries(
                        (item.ingredients || []).map(ing => [
                            ing.ingredient || ing.id || ing,
                            ing.amount || 1
                        ])
                    ),
                    originalPrice: Number(item.price)
                };

                //addition of new items to duck mascot thingy
                setOrderItems(prevItems => [...prevItems, newItem]);
                setIsOpen(true);
            }
            catch (error) {
                console.error("Error adding item:", error);
            }
        }
    }));

    const toggleDuck = () => {
        setIsOpen(!isOpen);
    };

    const toggleIngredients = (itemId) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    //function to handle addition or removal of ingredients
    const handleIngredientChange = (itemId, ingredient, action) => {
        setOrderItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === itemId) {
                    const newCounts = {...item.ingredientCounts};

                    if (action === 'add') {
                        newCounts[ingredient] = (newCounts[ingredient] || 0) + 1;
                    }
                    else if (action === 'remove' && newCounts[ingredient] > 0) {
                        newCounts[ingredient] = newCounts[ingredient] - 1;
                    }

                    return {
                        ...item,
                        ingredientCounts: newCounts
                    };
                }
                return item;
            });
        });
    };

    //functions needed for calcs & order functionality
    //NOTE: use toFixed(2) to make it into a string and round to dollar amount 1 -> 1.00

    const calculateItemIngredientTotal = (item) => {
        if (!item.ingredientCounts) return 0;

        const originalTotal = item.ingredients.length;
        const currentTotal = Object.values(item.ingredientCounts)
            .reduce((sum, count) => sum + count, 0);

        return (currentTotal - originalTotal) * INGREDIENT_PRICE;
    };

    const calculateItemPrice = (item) => {
        // Use the stored original price instead of the potentially modified price
        const basePrice = item.originalPrice || 0;
        const ingredientPrice = calculateItemIngredientTotal(item);
        return basePrice + ingredientPrice;
    };

    const removeItem = (index) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const calculateSubtotal = () => {
        return orderItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
    };

    const calculateDiscount = () => {
        return appliedPromo ? calculateSubtotal() * PROMO_DISCOUNT : 0;
    };

    const calculateTax = () => {
        return (calculateSubtotal() - calculateDiscount()) * TAX_RATE;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount() + calculateTax();
    };

    const handlePromoSubmit = (e) => {
        e.preventDefault();
        if (VALID_PROMO_CODES.includes(promoCode.toUpperCase())) {
            setAppliedPromo(promoCode.toUpperCase());
            setPromoError('');
        }
        else {
            setPromoError('Invalid promo code');
        }
        setPromoCode('');
    };


    const handleOrder = async () => {
        try {
            // Format extras array - calculate ingredient amount changes
            const extras = orderItems.flatMap(item => {
                // Only process items that have ingredients
                if (!item.ingredients || !item.ingredientCounts) return [];

                return item.ingredients.map(ingredient => {
                    // Handle both object and string ingredient formats
                    const ingredientId = typeof ingredient === 'object' ? ingredient.ingredient : ingredient;
                    const originalAmount = 1;
                    const currentAmount = item.ingredientCounts[ingredientId] || 0;
                    const difference = currentAmount - originalAmount;

                    if (difference === 0) return null;

                    return {ingredient: {id: Number(ingredientId)}, amount: difference};
                });
            }).filter(Boolean);

            // format order items array using the stored menuItemId
            const items = orderItems.map(item => ({
                menuItem: {
                    // using stored original menu item ID
                    id: Number(item.menuItemId)
                }
            }));

            // creating the order object
            const order = {
                customer: {
                    id: Math.floor(Math.random() * 1000) + 1
                },
                employee: {
                    id: 7
                },
                time: new Date().toISOString(),
                price: Number(calculateTotal().toFixed(2)),
                items: items,
                extras: extras
            };

            //debugging
            // console.log('Sending order:', JSON.stringify(order, null, 2));

            const response = await fetch('/api/orders/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'No error details available' }));
                throw new Error(`Server responded with ${response.status}: ${errorData.message}`);
            }

            const responseData = await response.json();
            console.log('Order response:', responseData);

            // clears order
            setOrderItems([]);
            setIsOpen(false);
            setAppliedPromo(null);
            setPromoError('');
            setExpandedItems({});

            //yippee it didnt fail
            alert('Order placed successfully!');
        }
        catch (error) {
            console.error('Error processing order:', error);
            alert(`Failed to place order: ${error.message}`);
        }
    };

    return (
        <div className="duck-mascot-container">
            {isOpen && (
                <div className="speech-box">
                    <div className="speech-box-header">
                        <h3>Order Summary</h3>
                        <button className="close-button" onClick={toggleDuck}>×</button>
                    </div>

                    <div className="speech-box-content">
                        {orderItems.length === 0 ? (
                            <p className="empty-message">Your cart is empty</p>
                        ) : (
                            orderItems.map((item, index) => (
                                <div key={item.id} className="order-item-container">
                                    <div className="order-item">
                                        <button className="item-name-button" onClick={() => toggleIngredients(item.id)}>
                                            <span>{item.name}</span>
                                        </button>
                                        <span>${calculateItemPrice(item).toFixed(2)}</span>
                                        <button className="remove-item" onClick={() => removeItem(index)}>
                                            ×
                                        </button>
                                    </div>

                                    {expandedItems[item.id] && (
                                        <div className="ingredients-list">
                                            <p className="ingredients-title">Ingredients:</p>
                                            {item.ingredients.map((ingredient, idx) => {

                                                // handles ingredients
                                                const ingredientId = ingredient.ingredient || ingredient;
                                                return (
                                                    <div key={idx} className="ingredient-item">
                                                        <span className="ingredient-name">
                                                            {ingredientNames[ingredientId] || `Loading...`}
                                                            <span className="ingredient-count">
                                                                × {item.ingredientCounts[ingredientId] || 0}
                                                            </span>
                                                        </span>

                                                        {/* controls how many ingredients are added or taken away */}
                                                        <div className="ingredient-controls">
                                                            <button className="ingredient-button remove"
                                                                onClick={() => handleIngredientChange(
                                                                    item.id,
                                                                    ingredientId,
                                                                    'remove'
                                                                )}
                                                                disabled={!item.ingredientCounts[ingredientId]}>
                                                                -
                                                            </button>
                                                            <button className="ingredient-button add"
                                                                onClick={() => handleIngredientChange(
                                                                    item.id,
                                                                    ingredientId,
                                                                    'add'
                                                                )}>
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/*  overall price change in relation to ingredients */}
                                            {calculateItemIngredientTotal(item) !== 0 && (
                                                <p className="ingredient-price-change">
                                                    Ingredient adjustments:
                                                    ${calculateItemIngredientTotal(item).toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* speech box from duck, modified to handle promo codes */}
                    <div className="speech-box-footer">

                        {/* if promo isnt applied, promo section is available */}
                        {!appliedPromo && (
                            <form onSubmit={handlePromoSubmit} className="promo-form">
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="Enter promo code"
                                    className="promo-input"
                                />
                                <button type="submit" className="promo-button">Apply</button>
                            </form>
                        )}

                        {/* no/incorrect promo */}
                        {promoError && <p className="promo-error">{promoError}</p>}

                        {/* if appliedPromo is true (lol the naming speaks for itself) */}
                        {appliedPromo && (
                            <div className="applied-promo">
                                Promo code {appliedPromo} applied!
                            </div>
                        )}

                        {/* calculation of price at bottom of speech text */}
                        <div className="price-breakdown">
                            <div className="price-row">
                                <span>Subtotal:</span>
                                <span>${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            {appliedPromo && (
                                <div className="price-row discount">
                                    <span>Discount (20%):</span>
                                    <span>-${calculateDiscount().toFixed(2)}</span>
                                </div>
                            )}
                            <div className="price-row">
                                <span>Tax (8.25%):</span>
                                <span>${calculateTax().toFixed(2)}</span>
                            </div>
                            <div className="price-row total">
                                <span>Total:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                        <button className="order-button" onClick={handleOrder} disabled={orderItems.length === 0}>
                            Place Order
                        </button>
                    </div>
                </div>
            )}
            <img
                src={isOpen ? '/images/duckopen.png' : '/images/duckidle.png'}
                alt="Duck Mascot"
                className="duck-mascot"
                onClick={toggleDuck}
            />
        </div>
    );
});

export default DuckMascot;