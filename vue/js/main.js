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
    </div>
    <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
    <button v-on:click="subFromCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Sub from cart</button>
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
        //     this.cart -= 1
        //     if (this.cart <= 0) {
        //         this.cart = 0
         },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
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
        },
        methods: {
            updateCart(id) {
                this.cart.push(id);
            },
            subCart(id) {
                this.cart.pop();
            }

        }
    })

