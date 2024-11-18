import React, {useEffect, useState} from 'react';
import "./Kitchen.css";

let tempNum = 1;

function Kitchen() {
    const [currentOrders, setCurrentOrders] = useState([]);
    const [officialMenuItems, setOfficialMenuItems] = useState([]);
    const [ingredientNames, setIngredientNames] = useState([]);
    const [orderIndex, setOrderIndex] = useState(0);

    // Gets all the current active orders
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("/api/orders/69352", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const orderList = await response.json();
                    setCurrentOrders([...currentOrders, orderList, orderList, orderList, orderList, orderList, orderList, orderList, orderList, orderList, orderList, orderList]);
                } else {
                    console.error("Failed to fetch orders:", response.status);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchItems();
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
    }, []);

    function completeOrder(OrderNumber) {
        setCurrentOrders((prevOrders) => prevOrders.filter((item, index) => index !== OrderNumber));

        // Adjusts the screen to show at minimum 8 orders
        if( (currentOrders.length > 8) && (orderIndex + 8 >= currentOrders.length) ){
            console.log("x");
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

        return (
            <div className="Item-Container">
                {officialItem.name}
                <div className="Ingredients-Container">{ingredients}</div>
            </div>
        )
    }

    function createOrderContainer(order){
        let orderItems = order.items;

        let orderItemsContainers = [];
        for (let i = 0; i < orderItems.length; i++) {
            orderItemsContainers.push(createItemContainer(orderItems[i]));
        }


        return (
            <div className="Kitchen-Order">
                <div className="Order-Header">
                    <div className="Order-Number">ID: {order.order_id}</div>
                    <div className="Order-Timer">{tempNum++}</div>
                </div>

                <div className="Order-Container">
                    {orderItemsContainers}
                </div>
            </div>
        )
    }


    // Checks if the objects exist, if not gives a default




    let orderContainers = [];
    orderContainers = currentOrders.slice(orderIndex, orderIndex + 8).map(order => createOrderContainer(order));

    useEffect(() => {
        orderContainers = currentOrders.slice(orderIndex, orderIndex + 8).map(order => createOrderContainer(order));
        // console.log("Updated currentOrders:", currentOrders);
    }, [orderIndex]);

    return (
        <div className="Screen-Container">
            <div className="Kitchen-Screen">
                {orderContainers}
            </div>
        </div>
    )
}

export default Kitchen;