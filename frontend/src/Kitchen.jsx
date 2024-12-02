import React, {useEffect, useState} from 'react';
import "./Kitchen.css";
import AccessibilityPanel from './components/AccessibilityPanel';
import {useAuth0} from "@auth0/auth0-react";

function Kitchen({logout, setIsTranslateVisible}) {
    const [currentOrders, setCurrentOrders] = useState([]);
    const [officialMenuItems, setOfficialMenuItems] = useState([]);
    const [ingredientNames, setIngredientNames] = useState([]);
    const [orderIndex, setOrderIndex] = useState(0);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const { getAccessTokenSilently } = useAuth0();

    // Gets all the current active orders
    // Fetch incomplete orders
    const fetchIncompleteOrders = async () => {
        try {
            const token = await getAccessTokenSilently()
            const response = await fetch('/api/orders/status/incomplete', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const orderList = await response.json();
                setCurrentOrders(orderList); // Update current orders state
            } else {
                console.error('Failed to fetch orders:', response.status);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Polling mechanism to periodically fetch orders every 5 seconds
    useEffect(() => {
        fetchIncompleteOrders(); // Initial fetch
        const interval = setInterval(fetchIncompleteOrders, 1000); // Fetch every second

        return () => {
            clearInterval(interval); // Cleanup interval on unmount
        };
    }, []);

    // Gets all the menu items for changing an ID into a name
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("/api/menuitem/all", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const menuItemList = await response.json();

                    setOfficialMenuItems(menuItemList);
                } else {
                    console.error("Failed to fetch menu items:", response.status);
                }
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };

        fetchItems();

        const interval = setInterval(fetchItems, 1000); // Fetch every second

        return () => {
            clearInterval(interval); // Cleanup interval on unmount
        };
    }, []);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch("/api/inventory/all", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });


                if (response.ok) {
                    const ingredients = await response.json();

                    setIngredientNames(ingredients);
                } else {
                    console.error("Failed to fetch ingredients:", response.status);
                }

            } catch (error) {
                console.error('Error finding ingredient:', error);
                alert(`Failed to find ingredient: ${error.message}`);
            }
        }

        fetchIngredients();
        const interval = setInterval(fetchIngredients, 1000); // Fetch every second

        return () => {
            clearInterval(interval); // Cleanup interval on unmount
        };
    }, []);

    function completeOrder (OrderNumber) {
        let apiText = "api/orders/update/status/" + currentOrders[OrderNumber].order_id + "?status=complete"
        // console.log(apiText);
        const handleCompletion = async () => {
            const token = await getAccessTokenSilently()
            const response = await fetch(apiText, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // if(response.ok) {
            //     console.log("x");
            // }
        }
        handleCompletion();


        setCurrentOrders((prevOrders) => prevOrders.filter((item, index) => index !== OrderNumber));

        // Adjusts the screen to show at minimum 8 orders
        if( (currentOrders.length > 8) && (orderIndex + 8 >= currentOrders.length) ){
            setOrderIndex(orderIndex - 1);
        }
    }

    const handleKeyPress = (event) => {
        // Check if the pressed key is "1"
        if (event.key === "1") {
            completeOrder(orderIndex);  // Remove the item at index 0 (first item)
        }else if (event.key === "2") {
            completeOrder(orderIndex + 1);  // Remove the item at index 0 (first item)
        }else if (event.key === "3") {
            completeOrder(orderIndex + 2);  // Remove the item at index 0 (first item)
        }else if (event.key === "4") {
            completeOrder(orderIndex + 3);  // Remove the item at index 0 (first item)
        }else if (event.key === "5") {
            completeOrder(orderIndex + 4);  // Remove the item at index 0 (first item)
        }else if (event.key === "6") {
            completeOrder(orderIndex + 5);  // Remove the item at index 0 (first item)
        }else if (event.key === "7") {
            completeOrder(orderIndex + 6);  // Remove the item at index 0 (first item)
        }else if (event.key === "8") {
            completeOrder(orderIndex + 7);  // Remove the item at index 0 (first item)
        }

        if (event.key === "ArrowLeft" && orderIndex > 0) {
            setOrderIndex(orderIndex - 1);
        } else if (event.key === "ArrowRight" && orderIndex + 8 < currentOrders.length) {
            setOrderIndex(orderIndex + 1);
        }

        // Error checking button
        if (event.key === "Enter") {
            console.log(currentOrders);
            console.log(orderIndex);
            console.log(currentOrders.length);
        }
    };

    useEffect(() => {
        // Add event listener for keydown event
        window.addEventListener("keydown", handleKeyPress);

        // Cleanup event listener when the component is unmounted
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [currentOrders, orderIndex]);

    function createItemContainer(item){
        const officialItem = officialMenuItems.find(menuItem => menuItem.id === item.menu_item_id);
        const extras = item.extras;

        let ingredients = [];
        for(let i = 0; i < extras.length; i++){
            let extra = extras[i];
            const ingredient = ingredientNames.find(ingredientInput => ingredientInput.id === extra.ingredient_id);

            if(extra.amount !== 0){
                ingredients.push(
                    <div className={`Ingredient-Single-Container ${extra.amount < 0 ? 'none' : 'extra'}`}>
                        <div className="Ingredient-Name">{ingredient.name}</div>
                        <div className="Ingredient-Amount">
                            {extra.amount < 0 ? "None" : `Extra: ${extra.amount}`}
                        </div>
                    </div>
                );
            }
        }

        if(officialItem.category === "drink"){
            return (
                <div className="Item-Container-Drink">{officialItem.name}</div>
            )
        }else{
            return (
                <div className="Item-Container">
                    {officialItem.name}
                    <div className="Ingredients-Container">{ingredients}</div>
                </div>
            )
        }
    }

    function createOrderContainer(order, buttonNumber){
        let orderItems = order.items;
        const orderTime = new Date(order.time);
        const currentTime = new Date();

        const diffInMilliseconds = currentTime - orderTime;
        const diffInSeconds = Math.floor(diffInMilliseconds / 1000); // Total seconds
        const minutes = Math.floor(diffInSeconds / 60);  // Extract minutes
        const seconds = diffInSeconds % 60;  // Extract remaining seconds

        const timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const textStyle = {
            color: minutes < 3
                ? 'lightgreen'            // Less than 3 minutes: light green
                : minutes >= 3 && minutes < 5
                    ? 'yellow'              // Between 3 and 5 minutes (inclusive): yellow
                    : 'red',               // More than 5 minutes: red
        };

        let orderItemsContainers = [];
        for (let i = 0; i < orderItems.length; i++) {
            orderItemsContainers.push(createItemContainer(orderItems[i]));
        }


        return (
            <div className="Kitchen-Order">
                <div className="Background-Number">{buttonNumber}</div>
                <div className="Order-Header">
                    <div className="Order-Number">ID: {order.order_id}</div>
                    <div className="Order-Timer" style={textStyle}>{timeText}</div>
                </div>

                <div className="Order-Container">
                    {orderItemsContainers}
                </div>
            </div>
        )
    }


    // Checks if the objects exist, if not gives a default




    let orderContainers = [];
    orderContainers = currentOrders.slice(orderIndex, orderIndex + 8).map( (order, index) => createOrderContainer(order, index + 1));

    useEffect(() => {
        orderContainers = currentOrders.slice(orderIndex, orderIndex + 8).map((order, index) => {
            return createOrderContainer(order, index + 1);  // Pass the correct button number (index + 1)
        });
    }, [orderIndex, currentOrders]);

    const handlePopupOpen = () => {
        setIsPopupOpen(true);
        setIsTranslateVisible(true);
        window.scrollTo(0, 0);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
        setIsTranslateVisible(false);
    };

    const [isHighContrast, setIsHighContrast] = useState(false);


    const toggleHighContrastMode = () => {
        setIsHighContrast((prev) => !prev);
        const appContent = document.querySelector('.app-content');
        if (appContent) {
            const isHighContrastMode = appContent.classList.contains('high-contrast');
            appContent.classList.toggle('high-contrast', !isHighContrastMode);
        }
    };

    return (
        <div>
            {isPopupOpen && (
                <div className="Screen-Popup">
                    <button className="close-button" onClick={() => handlePopupClose()}>X</button>
                    <div className="accessibility-panel-kitchen">
                        <div className="accessibility-row">
                            <label className="accessibility-label">
                                High Contrast
                                <button onClick={toggleHighContrastMode}
                                        className="accessibility-toggle-button"
                                        aria-pressed={isHighContrast}
                                >
                                    <div
                                        className="accessibility-toggle-knob"
                                        style={{
                                            '--toggle-knob-position': isHighContrast ? '26px' : '2px',
                                            '--toggle-background': isHighContrast ? '#4CAF50' : '#e2e2e2',
                                        }}
                                    />
                                </button>
                            </label>
                        </div>
                    </div>
                </div>
            )}
            {!isPopupOpen && (
                <div className="Screen-Container">
                    <div className="Kitchen-Screen">
                        {currentOrders.length > 0 ? (
                            orderContainers // Directly render the orderContainers when there are orders
                        ) : (
                            <div className="Orders-Empty">No Orders</div> // Show "No Orders" when there are no orders
                        )}
                    </div>
                    <div className="Control-Buttons">
                        <button className="Exit-Button" onClick={() => logout()}>Log Out</button>

                        <div className="Complete-Container">
                            <button className="Complete-Button" onClick={() => completeOrder(orderIndex)}>1</button>
                            <button className="Complete-Button" onClick={() => completeOrder(orderIndex + 1)}>2</button>
                            <button className="Complete-Button" onClick={() => completeOrder(orderIndex + 1)}>3</button>
                            <button className="Complete-Button" onClick={() => completeOrder(orderIndex + 1)}>4</button>
                            <button className="Complete-Button" onClick={() => completeOrder(orderIndex + 1)}>5</button>
                            <button className="Complete-Button" onClick={() => completeOrder(orderIndex + 1)}>6</button>
                            <button className="Complete-Button" onClick={() => completeOrder(orderIndex + 1)}>7</button>
                            <button className="Complete-Button" onClick={() => completeOrder(orderIndex + 1)}>8</button>
                        </div>

                        <div className="Navigation-Container">
                            <button className="Navigation-Button" onClick={() => {
                                if (orderIndex + 8 < currentOrders.length) {
                                    setOrderIndex(orderIndex + 1);
                                }
                            }}
                            >&gt;</button>
                            <button className="Navigation-Button" onClick={() => {
                                if (orderIndex > 0) {
                                    setOrderIndex(orderIndex - 1);
                                }
                            }}
                            >&lt;</button>
                        </div>

                        <button className="Accessibility-Button" onClick={() => handlePopupOpen()}>Settings</button>
                    </div>
                </div>
            )
            }
        </div>
    )
}

export default Kitchen;