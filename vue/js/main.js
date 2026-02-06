Vue.component('product-review', {
    template: `

<form class="review-form" @submit.prevent="onSubmit">

<p v-if="errors.length">
 <b>Please correct the following error(s):</b>
 <ul>
   <li v-for="error in errors">{{ error }}</li>
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
                    <label>Would you recommend this product?</label>
                    <label>
                        <input type="radio" value="yes" v-model="recommendation"> Yes 
                    </label>
                    <label>
                        <input type="radio" value="no" v-model="recommendation"> No
                    </label>
                </p>
    <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>

 <p>
   <input type="submit" value="Submit"> 
 </p>

</form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommendation: null,
            errors: []
        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recomendation: this.recommendation
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommendation = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }
    }
})

Vue.component('product-details', {
    props: {
        details:{
            type: Array,
            required: true
        }
    },
    template:`
    <ul>
        <li v-for="detail in details">{{detail}}</li>
    </ul>
    `
})

Vue.component('product', {
    props: {
        premium:{
            type: Boolean,
            required: true
        }
    },
    template: `
<div class="product">
    <div class="product-image">
        <img v-bind:src="image" v-bind:alt="altText"/>
    </div>

    <div class="product-info">
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        <a v-bind:href="link">More products like this</a>
        <p v-if="inStock">In Stock</p>
        <p v-else :class="{Nostock: !inStock}">Out of Stock</p>
        <span>{{ sale }}</span>
        <product-details :details="details"></product-details>
        <p>Shipping: {{ shipping }}</p>
        <div
                class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)"
        ></div>
        <div v-for="size in sizes">
            <p>{{ size }}</p>
        </div>
<!--    </div>-->
    <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
    <button v-on:click="subFromCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Sub from cart</button>
        <product-review @review-submitted="addReview"></product-review>
                     <div>
    <h2>Reviews</h2>
    <p v-if="!reviews.length">There are no reviews yet.</p>
    <ul>
      <li v-for="review in reviews">
      <p>{{ review.name }}</p>
      <p>Rating: {{ review.rating }}</p>
      <p>{{ review.review }}</p>
      </li>
    </ul>
    </div>
</div>
`,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks.",
            link: "More products like this",
            selectedVariant: 0,
            altText: "A pair of socks",
            inStock: true,
            OnSale: true,
            reviews: [],
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        subFromCart() {
             this.$emit('sub-from-cart', this.variants[this.selectedVariant].variantId);
         },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }

    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale(){
            if (this.OnSale === true)
                return this.brand + ' sells ' + this.product + ' with 0% discount ';
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    }
})
    let app = new Vue({
        el: '#app',
        data: {
            premium: true,
            cart: [],
            review: []
        },
        methods: {
            updateCart(id) {
                this.cart.push(id);
            },
            subCart(id) {
                this.cart.pop(id);
            }

        }
    })

