const routes = {
  home: "/",
  auth: {
    login: "/login",
    register: "/register"
  },
  api: {
    auth: {
      login: "/login",
      logout: "/logout"
    },
    offers: {
      getOffers: (from: string, to: string) => `/offers?from=${from}&to=${to}&limit=10`,
      getOfferById: (id: string) => `/offers/${id}`,
      createOffer: `/offers`
    }
  }
}

export default routes
