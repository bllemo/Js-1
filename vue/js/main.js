let eventBus = new Vue();

// Компонент для отображения вкладок с информацией о продукте
Vue.component('product-tabs', {
    props: {
        reviews: { // Отзывы о продукте
            type: Array,
            required: false
        },
        shippingCost: { // Стоимости доставки
            type: String,
            required: true
        },
        details: { // Детали продукта
            type: Array,
            required: true
        }
    },
    template: `
            <div>   
                <ul>
                    <span class="tab"
                          :class="{ activeTab: selectedTab === tab }"
                          v-for="(tab, index) in tabs"
                          @click="selectedTab = tab"
                    >{{ tab }}</span>
                </ul>
                <div v-show="selectedTab === 'Reviews'">
                    <p v-if="!reviews.length">There are no reviews yet.</p>
                    <ul>
                        <li v-for="review in reviews" :key="review.name">
                            <p>{{ review.name }}</p>
                            <p>Rating: {{ review.rating }}</p>
                            <p>{{ review.review }}</p>
                            <p>Recommended: {{ review.recommendation }}</p>
                        </li>
                    </ul>
                </div>
                <div v-show="selectedTab === 'Make a Review'">
                    <product-review></product-review>
                </div>
                <div v-show="selectedTab === 'Shipping'">
                    <p>Shipping Cost: {{ shippingCost }}</p>
                </div>
                <div v-show="selectedTab === 'Details'">
                    <h2>Details:</h2>
                    <ul>
                        <li v-for="detail in details" :key="detail">{{ detail }}</li>
                    </ul>
                </div>
            </div>
            `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'], // Названия вкладок
            selectedTab: 'Reviews' // Вкладка по умолчанию
        }
    }
});

// Компонент для формы отзыва о продукте
Vue.component('product-review', {
    template: `
            <form class="review-form" @submit.prevent="onSubmit">
                <p v-if="errors.length">
                    <b>Please correct the following error(s):</b>
                    <ul>
                        <li v-for="error in errors" :key="error">{{ error }}</li>
                    </ul>
                </p>
                <p>
                    <label for="name">Name:</label>
                    <input id="name" v-model="name" placeholder="name">
                </p>
                <p>
                    <label for="review">Review:</label>
                    <textarea id="review" v-model="review"></textarea>
                </p>
                <p>
                    <label for="rating">Rating:</label>
                    <select id="rating" v-model.number="rating">
                        <option disabled value="">Please select one</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                </p>
                <p>
                    <label>Would you recommend this product?</label>
                    <label>
                        <input type="radio" value="yes" v-model="recommendation"> Yes
                    </label>
                    <label>
                        <input type="radio" value="no" v-model="recommendation"> No
                    </label>
                </p>
                <p>
                    <input type="submit" value="Submit"> 
                </p>
            </form>
            `,
    data() {
        return {
            name: '', // Имя пользователя
            review: '', // Текст отзыва
            rating: null, // Рейтинг
            recommendation: '', // Рекомендация
            errors: [] // Ошибки валидации
        }
    },
    methods: {
        onSubmit() {
            this.errors = []; // Сбрасываем ошибки
            // Проверяем, заполнены ли все поля
            if (this.name && this.review && this.rating && this.recommendation) {
                const productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommendation: this.recommendation
                };
                // Отправляем отзыв через event bus
                eventBus.$emit('review-submitted', productReview);
                this.resetForm(); // Сбрасываем форму
            } else {
                // Добавляем ошибки валидации
                this.errors.push(...[
                    !this.name && "Name required.",
                    !this.review && "Review required.",
                    !this.rating && "Rating required.",
                    !this.recommendation && "Recommendation required."
                ].filter(Boolean));
            }
        },
        resetForm() {
            // Сбрасываем поля формы
            this.name = '';
            this.review = '';
            this.rating = null;
            this.recommendation = '';
        }
    }
});

// Компонент для отображения деталей продукта
Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
            <div>
                <h2>Details:</h2>
                <ul>
                    <li v-for="detail in details" :key="detail">{{ detail }}</li>
                </ul>
            </div>
            `
});

// Основной компонент продукта
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
            <div class="product">
                <div class="product-image">
                    <img :src="image" :alt="altText"/>
                </div>
                <div class="product-info">
                    <h1>{{ title }}</h1>
                    <p>{{ description }}</p>
                    <a :href="link">More products like this</a>
                    <p v-if="inStock">In stock</p>
                    <p v-else style="text-decoration: line-through">Out of Stock</p>
                    <span v-if="onSale"> On Sale </span <br><br>
                    <p>{{ sale }}</p>
                    <div
                        class="color-box"
                        v-for="(variant, index) in variants"
                        :key="variant.variantId"
                        :style="{ backgroundColor: variant.variantColor }"
                        @mouseover="updateProduct(index)"
                    ></div>
                    <h2>Available Sizes:</h2>
                    <ul>
                        <li v-for="size in sizes" :key="size">{{ size }}</li>
                    </ul>
                    <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
                    <button @click="removeFromCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Remove from cart</button>
                </div>
                <div>
                    <product-tabs :reviews="reviews" :shipping-cost="shipping" :details="details"></product-tabs>
                </div>
            </div>
            `,
    data() {
        return {
            reviews: [], // Массив для хранения отзывов
            product: "Socks", // Название продукта
            brand: 'Vue Mastery', // Бренд продукта
            description: "A pair of warm, fuzzy socks", // Описание продукта
            altText: "A pair of socks", // Альтернативный текст для изображения
            selectedVariant: 0, // Выбранный вариант продукта
            link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks', // Ссылка на другие продукты
            onSale: true, // Статус распродажи
            details: ['80% cotton', '20% polyester', 'Gender-neutral'], // Детали продукта
            variants: [ // Варианты продукта
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'], // Доступные размеры
            cart: [] // Корзина для хранения добавленных товаров
        }
    },
    methods: {
        addToCart() {
            // Добавляем товар в корзину
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart() {
            // Удаляем товар из корзины
            this.$emit('remove-from-cart');
        },
        updateProduct(index) {
            // Обновляем выбранный вариант продукта
            this.selectedVariant = index;
        },
        addReview(productReview) {
            // Добавляем отзыв о продукте
            this.reviews.push(productReview);
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    },
    computed: {
        title() {
            // Возвращаем полное название продукта
            return this.brand + ' ' + this.product;
        },
        image() {
            // Возвращаем изображение выбранного варианта
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity > 0;
        },
        sale(){
            if (this.OnSale === true)
                return this.brand + ' sells ' + this.product + ' with 0% discount ';
        },
        shipping()  {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    }
});

// Основной экземпляр Vue приложения
let app = new Vue({
    el: '#app', // Привязываем приложение к элементу с id 'app'
    data: {
        premium: true, // Статус премиум-клиента
        cart: [] // Корзина для хранения добавленных товаров
    },
    methods: {
        updateCart(id) {
            // Добавляем товар в корзину
            this.cart.push(id);
        },
        updateRemoveFromCart() {
            // Удаляем последний добавленный товар из корзины
            this.cart.pop();
        }
    },
});