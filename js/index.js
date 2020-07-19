document.addEventListener("DOMContentLoaded", function () {
  new Vue({
    el: "#pricing",
    // define data - initial display text
    data: {
      package: "family",
      companies: [
        {
          name: "Hygeia HMO",
          logo:
            "https://www.hygeiahmo.com/wp-content/uploads/2018/11/Hygeia-Final-No-Left-Padding@1x.svg",
          family: {
            price: 50000,
            benefits: [
              "Frequent Checkups",
              "One Doctor Per Member",
              "Private Room",
            ],
          },
          individual: {
            price: 10000,
            benefits: ["Constant Checkups", "Private Room"],
          },
        },
        {
          name: "Avon HMO",
          logo:
            "https://www.confirmed.ng/wp-content/uploads/2018/04/Avon-logo.png",
          family: {
            price: 55000,
            benefits: [
              "Weekly Checkups",
              "2/7 Support",
              "One Medical Team Per Member",
            ],
          },
          individual: {
            price: 15000,
            benefits: ["24/7 Support", "Private Room"],
          },
        },

        {
          name: "Reliance HMO",
          logo: "https://www.reliancehmo.com/img/logo.svg",
          family: {
            price: 60000,
            benefits: ["Access anytime", "Ambulance", "Weekly Checkups"],
          },
          individual: {
            price: 20000,
            benefits: ["Diet Practitioner", "Exercise Instructor"],
          },
        },
      ],
      searchText: "",
    },
    methods: {
      formatAmount: (amount) => parseFloat(amount).toLocaleString("en"),
    },
    computed: {
      filteredCompanies() {
        return this.companies.filter(
          (key) =>
            key.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
            key[this.package].benefits
              .map((i) => i.toLowerCase())
              .includes(this.searchText.toLowerCase()) ||
            String(key[this.package].price)
              .toLowerCase()
              .includes(String(this.searchText).toLowerCase())
        );
      },
    },
  });
});
