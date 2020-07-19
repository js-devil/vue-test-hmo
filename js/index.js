const methods = {
  formatAmount: (amount) => parseFloat(amount).toLocaleString("en"),
  selectInsurance(obj) {
    this.selected = obj;
    $("#checkout").modal();
  },
  validateNum(key) {
    let string = String(this[key]).replace(/ /g, "").replace(/\//g, "");
    if (!this.validateNumbers(string))
      this[key] = String(this[key]).slice(0, -1);
  },

  numberWithSpaces: (x) => x.replace(/\W/gi, "").replace(/(.{4})/g, "$1 "),
  removeSpaces: (text) => text.replace(/(^\s+|\s+$)/, ""),

  validateName: (value) => value.length > 2,
  validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  validateNumbers: (value) => /^\d+$/.test(value),
  validateDate: (date) => date instanceof Date && !isNaN(date),
};

document.addEventListener("DOMContentLoaded", function () {
  Vue.component("checkout-form", {
    template: `
   <div id="checkout" class="modal fade">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="form-container">
        
          <form id="logInForm" @submit.prevent="makePayment">
            <div class="logo">
              <img :src="selected.logo" />
            </div>

            <div class="input">
              <p>Monthly Fee <span>({{ selected.package }})</span> </p>
              <p>₦{{ formatAmount(selected.price) }}</p>
            </div>

            <div class="form-group">
              <input type="text" class="form-control-input" v-model="name" id="name" required />
              <label class="label-control" for="name">Your Name</label>
              <div class="help-block with-errors text-danger text-left" v-if="errorMsg.includes('name')">{{ errorMsg }}</div>
            </div>

            <div class="form-group">
              <input type="email" class="form-control-input" v-model="email" id="email" required />
              <label class="label-control" for="email">Your Email</label>
              <div class="help-block with-errors text-danger text-left" v-if="errorMsg.includes('email')">{{ errorMsg }}</div>
            </div>

            <div class="input" style="margin-bottom: 0;">
              <input
                maxlength="19"
                type="tel"
                v-model="card_number"
                class="form-control-input"
                placeholder="Card Number"
                required
              />
              <input
                type="tel"
                id="cvv"
                v-model="cvv"
                maxlength="3"
                class="form-control-input"
                placeholder="CVV"
                required
              />
              <input
                type="tel"
                maxlength="5"
                id="expiry"
                v-model="expiry"
                class="form-control-input"
                placeholder="MM/YY"
                required
              />
            </div>
            <div class="help-block with-errors text-danger text-left" v-if="errorMsg.includes('card') || errorMsg.includes('CVV') || errorMsg.includes('date')">{{ errorMsg }}</div>

            <div class="form-group" style="margin-top: 20px;">
              <button type="submit" @click.prevent="makePayment" class="form-control-submit-button disabled">Pay</button>
            </div>

            <div class="form-message">
              <div id="lmsgSubmit" class="h3 text-center"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
    `,
    props: ["selected"],
    methods: {
      ...methods,
      makePayment() {
        const { card_number, cvv, expiry, name, email, selected } = this;
        let expiry_date = new Date(expiry.split("/").join("/01/"));

        this.errorMsg = !this.validateName(name)
          ? "Please enter a valid name"
          : !this.validateEmail(email)
          ? "Please enter a valid email address"
          : card_number.replace(/ /g, "").length !== 16
          ? "Please enter a valid card number"
          : cvv.length !== 3
          ? "Please enter a valid CVV"
          : !this.validateDate(expiry_date)
          ? "Please enter a valid expiration date"
          : "";

        if (this.errorMsg.length > 1) return;

        $("#checkout").modal("toggle");
        this.$emit("show-success", { email, selected, name });
      },
    },
    data() {
      return {
        errorMsg: "",
        card_number: "",
        cvv: "",
        expiry: "",
        email: "",
        name: "",
      };
    },
    watch: {
      card_number() {
        this.validateNum("card_number");
        this.card_number = this.numberWithSpaces(this.card_number);
        if (this.card_number.length >= 19) {
          this.card_number = this.card_number.slice(0, -1);
          document.querySelector("#cvv").focus();
        }
      },
      cvv() {
        this.validateNum("cvv");
        if (this.cvv.length == 3) document.querySelector("#expiry").focus();
      },
      expiry(old, current) {
        this.validateNum("expiry");
        if (this.expiry.length == 2 && !this.expiry.includes("/"))
          this.expiry = this.expiry + "/";
        if (old.length > 4 && current.slice(-1) == "/") this.expiry = "";
      },
    },
  });

  new Vue({
    el: "#pricing",
    // define data - initial display text
    data: {
      selected: {},
      package: "family",
      companies: [
        {
          id: 1,
          name: "Hygeia HMO",
          logo:
            "https://www.hygeiahmo.com/wp-content/uploads/2018/11/Hygeia-Final-No-Left-Padding@1x.svg",
          family: {
            price: 50000,
            benefits: [
              "Frequent Checkups",
              "One Doctor",
              "Private Room",
              "Frequent Checkups",
              "One Doctor",
              "Private Room",
            ],
          },
          individual: {
            price: 10000,
            benefits: [
              "Constant Checkups",
              "Private Room",
              "Constant Checkups",
              "Private Room",
              "Constant Checkups",
              "Private Room",
              "Constant Checkups",
              "Private Room",
            ],
          },
        },
        {
          id: 2,
          name: "Avon HMO",
          logo:
            "https://www.confirmed.ng/wp-content/uploads/2018/04/Avon-logo.png",
          family: {
            price: 55000,
            benefits: [
              "Weekly Checkups",
              "2/7 Support",
              "One Medical Team",
              "Constant Checkups",
              "Private Room",
              "One Medical Team",
            ],
          },
          individual: {
            price: 15000,
            benefits: [
              "24/7 Support",
              "Private Room",
              "Constant Checkups",
              "Private Room",
              "Constant Checkups",
              "Private Room",
            ],
          },
        },

        {
          id: 3,
          name: "Reliance HMO",
          logo: "https://www.reliancehmo.com/img/logo.svg",
          family: {
            price: 60000,
            benefits: [
              "Access anytime",
              "Ambulance",
              "Weekly Checkups",
              "One Medical Team",
              "Constant Checkups",
              "Private Room",
            ],
          },
          individual: {
            price: 20000,
            benefits: [
              "Diet Practitioner",
              "Exercise Instructor",
              "24/7 Support",
              "Constant Checkups",
              "Private Room",
            ],
          },
        },
      ],
      searchText: "",
      info: {},
      showSuccess: false,
      more: [],
    },
    methods: {
      ...methods,
      getInfo(info) {
        this.info = info;
        $("#success").modal();
        this.showSuccess = true;
      },
      getPackage(event) {
        this.package = event.target.value;
        this.more.length = 0;
        this.$forceUpdate();
      },
      showMore(id) {
        for (let i in this.companies)
          if (this.companies[i].id == id) {
            if (!this.more.includes(id)) {
              this.companies[i][this.package].benefits.length =
                this.companies[i][this.package].benefits.length * 2;
              this.more = [...this.more, id];
              this.$forceUpdate();
            } else {
              this.companies[i][this.package].benefits.length =
                this.companies[i][this.package].benefits.length / 2;
              this.more = this.more.filter((key) => key !== id);
              this.$forceUpdate();
            }
          }
      },
    },
    computed: {
      filteredCompanies() {
        return this.companies.filter(
          (key) =>
            key.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
            key[this.package].benefits
              .join()
              .toLowerCase()
              .includes(this.searchText.toLowerCase()) ||
            String(key[this.package].price)
              .toLowerCase()
              .includes(String(this.searchText).toLowerCase())
        );
      },
    },
    mounted() {},
  });
});
