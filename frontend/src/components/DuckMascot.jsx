// import React, { useState, forwardRef, useImperativeHandle } from 'react';
// import './DuckMascot.css';

// const TAX_RATE = 0.0825;

// const DuckMascot = forwardRef((props, ref) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [orderItems, setOrderItems] = useState([]);
    
//     // function that handles when a menu item is clicked, will add to the order list
//     useImperativeHandle(ref, () => ({
//         addItem: (item) => {
//             setOrderItems(prevItems => [...prevItems, item]);
//             setIsOpen(true);
//         }
//     }));

//     // changing duck image function lol
//     const toggleDuck = () => {
//         setIsOpen(!isOpen);
//     };

//     //functions needed for calcs & order functionality
//     //NOTE: use toFixed(2) to make it into a string and round to dollar amount 1 -> 1.00

//     const removeItem = (index) => {
//         setOrderItems(orderItems.filter((_, i) => i !== index));
//     };

//     const calculateSubtotal = () => {
//         return orderItems.reduce((sum, item) => sum + item.price, 0);
//     };

//     const calculateTax = () => {
//         return calculateSubtotal() * TAX_RATE;
//     };

//     const calculateTotal = () => {
//         return calculateSubtotal() + calculateTax();
//     };

//     const handleOrder = () => {
//         alert('Order placed!');
//         setOrderItems([]);
//         setIsOpen(false);
//     };

//     return (
//         <div className="duck-mascot-container">
//             {isOpen && (
//                 <div className="speech-box">
//                     <div className="speech-box-header">
//                         <h3>Order Summary</h3>
//                         <button className="close-button" onClick={toggleDuck}></button>
//                     </div>
                    
//                     <div className="speech-box-content">
//                         {orderItems.length === 0 ? (<p className="empty-message">Your cart is empty</p>) : (
//                             orderItems.map((item, index) => (
//                                 <div key={index} className="order-item">
//                                     <span>{item.name}</span>
//                                     <span>${item.price.toFixed(2)}</span> 
//                                     <button className="remove-item"onClick={() => removeItem(index)}>
//                                         ×
//                                     </button>
//                                 </div>
//                             ))
//                         )}
//                     </div>

//                     <div className="speech-box-footer">
//                         <div className="price-breakdown">
//                             <div className="price-row">
//                                 <span>Subtotal:</span>
//                                 <span>${calculateSubtotal().toFixed(2)}</span>
//                             </div>
//                             <div className="price-row">
//                                 <span>Tax (8.25%):</span>
//                                 <span>${calculateTax().toFixed(2)}</span>
//                             </div>
//                             <div className="price-row total">
//                                 <span>Total:</span>
//                                 <span>${calculateTotal().toFixed(2)}</span>
//                             </div>
//                         </div>
//                         <button className="order-button" onClick={handleOrder} disabled={orderItems.length === 0} >
//                             Place Order
//                         </button>
//                     </div>

//                 </div>
//             )}
//             <img src={isOpen ? '/images/duckopen.png' : '/images/duckidle.png'} alt="Duck Mascot" className="duck-mascot" onClick={toggleDuck}/>
//         </div>
//     );
// });

// export default DuckMascot;


import React, { useState, forwardRef, useImperativeHandle } from 'react';
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

    // function that handles when a menu item is clicked, will add to the order list
    useImperativeHandle(ref, () => ({
        addItem: (item) => {
            const newItem = {
                // copies over item property
                ...item,
                
                // id is the current date to track new, will eventually be id added from database
                id: Date.now(), 
                
                // copy of ingredients, if not filled in, choose empty list
                modifiedIngredients: [...(item.ingredients || [])],

                ingredientCounts: Object.fromEntries(
                    // mapping ingredient name with ingredient count, starting at 1
                    (item.ingredients || []).map(ingr => [ingr, 1])
                )
            };

            //addition of new items to duck mascot thingy
            setOrderItems(prevItems => [...prevItems, newItem]);
            setIsOpen(true);
        }
    }));

    // changing duck image function lol
    const toggleDuck = () => {
        setIsOpen(!isOpen);
    };

    //ingredient handling functions
    const toggleIngredients = (itemId) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleIngredientChange = (itemId, ingredient, action) => {
        setOrderItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === itemId) {
                    const newCounts = { ...item.ingredientCounts };
                    
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
        const basePrice = item.price;
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


    // promo code calculations
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

    // yeets everything after ordered
    const handleOrder = () => {
        alert('Order placed!');
        setOrderItems([]);
        setIsOpen(false);
        setAppliedPromo(null);
        setPromoError('');
        setExpandedItems({});
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
                                            {item.ingredients.map((ingredient, idx) => (

                                                // handles ingredients
                                                <div key={idx} className="ingredient-item">
                                                    <span className="ingredient-name">
                                                        {ingredient}
                                                        {/* amount of ingredients lol, x 1 is normal, the 1 will change when added or subtracted */}
                                                        <span className="ingredient-count"> 
                                                            × {item.ingredientCounts[ingredient] || 0}
                                                        </span>
                                                    </span>

                                                    {/* controls how many ingredients are added or taken away */}
                                                    <div className="ingredient-controls">
                                                        <button className="ingredient-button remove" 
                                                        onClick={() => handleIngredientChange(item.id, ingredient, 'remove')} 
                                                        disabled={!item.ingredientCounts[ingredient]}>
                                                            -
                                                        </button>
                                                        
                                                        <button className="ingredient-button add"
                                                        onClick={() => handleIngredientChange(item.id, ingredient, 'add')}>
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

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
            <img src={isOpen ? '/images/duckopen.png' : '/images/duckidle.png'} alt="Duck Mascot" className="duck-mascot" onClick={toggleDuck}/>
        </div>
    );
});

export default DuckMascot;