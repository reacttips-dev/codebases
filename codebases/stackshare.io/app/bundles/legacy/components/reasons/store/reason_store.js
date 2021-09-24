import {observable} from 'mobx';

class ReasonStore {
  @observable isLoading = false;
  @observable endOfServices = false;
  @observable page = 1;
  @observable perPage = 10;
  @observable currentEndpointIndex = 0; // Start with the first priority endpoint - 'services_with_reasons'
  // @observable endpoints = ['user_created_pros_not_cons', 'user_upvoted_pros_not_cons', 'services_with_no_cons', 'services_by_popularity'] // Base criteria for loading services
  @observable endpoints = ['user_created_pros_not_cons', 'user_upvoted_pros_not_cons']; // Criteria to only show services that a user is a fan of
  @observable services = [];
  @observable animatePoints = false;
  @observable confirmDelete = false;
  @observable showCons = true;
  @observable visibleServiceCards = [];
  @observable trendingImagePath = '';

  constructor(props) {
    // Override the default showCons flag
    this.showCons = props.showCons;
    // Set the trending image asset path
    this.trendingImagePath = props.trending_image_path;
    // Set the currend endpoint index
    if (window.app_data.current_user.id === undefined) {
      // Use the default endpoint - 'services_by_popularity'
      this.currentEndpointIndex = 2;
      this.points = 0;
    } else {
      // Set the user's points
      this.points = window.app_data.current_user.popularity;
    }
    // Initial Request for Services
    this.loadServices()
      .then(() => {
        // Set the initial visible service card
        // this.visibleServiceCards.push(`service-${this.services[0].id}`)
        this.setCurrentServiceCard();
      })
      .catch(() => null);
    $(window)[0].addEventListener('scroll', this.scrollEvent);
  }

  toggleConfirmDelete = () => {
    this.confirmDelete = !this.confirmDelete;
  };

  scrollEvent = () => {
    // Only track the current service card in view if in mobile view
    // if ( $(window).width() < 768) {
    // this.setCurrentServiceCard()
    // }
    let win = $(window);
    let scroll = $(document).height() - win.height() - $(document).height() / 10;
    let limit = win.scrollTop();
    let offset = 1000;
    if (scroll - offset < limit) {
      if (this.isLoading === false && !this.endOfServices) {
        this.loadServices();
        trackEvent('pros_and_cons.scroll.loadMoreTools');
      }
    }
  };

  setCurrentServiceCard = () => {
    // Reset the array of visible service cards
    this.visibleServiceCards = [];
    let serviceCards = $('.service_card');
    serviceCards.each((i, el) => {
      let topOfElement = $(el).offset().top;
      let bottomOfElement = $(el).offset().top + $(el).outerHeight();
      let bottomOfScreen = $(window).scrollTop() + $(window).height();
      let topOfScreen = $(window).scrollTop();
      if (bottomOfScreen > topOfElement && topOfScreen < bottomOfElement) {
        let visibleServiceCardId = $(el).attr('id');
        this.visibleServiceCards.push(visibleServiceCardId);
      } else {
        // The element is not visible, do something else
      }
    });
  };

  mobileScrollToNextCard = () => {
    this.setCurrentServiceCard();
    let headerOffset = 68;
    let cardOffset = 20;
    let extraOffset = 10;
    let nextCard;
    let currentCard;
    if (this.visibleServiceCards.length === 1) {
      let currentServiceCardId = this.visibleServiceCards[0];
      currentCard = $(`#${currentServiceCardId}`);
      // If current card is below the top of the page scroll to it
      if (
        currentCard.offset().top >
        $(window).scrollTop() + headerOffset + cardOffset + extraOffset
      ) {
        // The current card is still below the top of the page so scroll to it
        nextCard = $(currentCard);
      } else {
        // The current card has passed the top of the page, so scroll to the next one
        nextCard = $(currentCard).next();
      }
    } else if (this.visibleServiceCards.length === 2) {
      // If the top of the second card is past the header scroll to the next
      let secondServiceCardId = this.visibleServiceCards[1];
      currentCard = $(`#${secondServiceCardId}`);
      if (
        currentCard.offset().top >
        $(window).scrollTop() + headerOffset + cardOffset + extraOffset
      ) {
        // We scroll to the second visible card because its still below the set position
        nextCard = $(currentCard);
      } else {
        // The second visible card is already past the set position to scroll to the following one
        nextCard = $(currentCard).next();
      }
    }
    if (nextCard.length !== 0) {
      let reasonsHeaderHeight = 68;
      let serviceCardTopMargin = 20;
      if (nextCard.attr('id') !== undefined) {
        // Scroll to the next card because it's defined
        let nextServiceCardId = $(nextCard).attr('id');
        this.visibleServiceCards = [nextServiceCardId];
        let nextCardTopOffset = nextCard.offset().top;
        $('html, body').animate(
          {
            scrollTop: nextCardTopOffset - reasonsHeaderHeight - serviceCardTopMargin
          },
          200
        );
        trackEvent('pros_and_cons.click.nextToolMobile');
      } else {
        // Scroll to the loading spinner
        $('html, body').animate(
          {
            scrollTop:
              $('#reasons_service_card_list--spinner').offset().top -
              reasonsHeaderHeight -
              serviceCardTopMargin
          },
          200
        );
        trackEvent('pros_and_cons.click.nextToolMobile');
      }
    }
  };

  toggleVote = reason => {
    let vote = !reason.user_voted_for;
    let id = reason.id;
    let data = {vote: vote};
    return new Promise((resolve, reject) => {
      let url = `/api/v1/pros-and-cons/${id}/toggle_vote`;
      $.post(url, data)
        .done(response => {
          let service = this.services.find(service => service.id === response.serviceId);
          let reasons = service[`${response.type}s`];
          let reason = reasons.find(reason => reason.id === response.id);
          reason.votes = response.votes;
          reason.user_voted_for = response.user_voted_for;
          resolve();
        })
        .fail(e => {
          reject(e);
        });
    });
  };

  createReason = (service, type, text) => {
    let con;
    if (type === 'pro') {
      con = false;
    } else if (type === 'con') {
      con = true;
    }
    let data = {reason: {service_id: service.id, text: text, con: con}};
    return new Promise((resolve, reject) => {
      let url = '/api/v1/pros-and-cons';
      $.post(url, data)
        .done(response => {
          let service = this.services.find(service => service.id === response.service_id);
          let reason = response.reason;
          let reasons = service[`${reason.type}s`];
          reasons.push(reason);
          this.points = response.points;
          resolve(reason);
        })
        .fail(e => {
          reject(e);
        });
    });
  };

  deleteReason = reasonId => {
    return new Promise((resolve, reject) => {
      let url = `/api/v1/pros-and-cons/${reasonId}`;
      $.ajax({
        method: 'DELETE',
        url: url
      })
        .done(response => {
          let service = this.services.find(service => service.id === response.service_id);
          let reasons = service[`${response.type}s`];
          let reason = reasons.find(reason => reason.id === response.reason_id);
          reasons.remove(reason);
          this.points = response.points;
          resolve();
        })
        .fail(e => {
          reject(e);
        });
    });
  };

  // Priority of loading services
  // 1. If user has created pros (BUT NOT CONS), load those services
  // 2. If user has upvoted PROS ( but not contributed or uprooted cons for), load those service
  // 3. Load services that don’t have cons
  // 4. Load services by popularity
  loadServices = () => {
    return new Promise((resolve, reject) => {
      // Show loading placeholder
      this.isLoading = true;
      let url = `/api/v1/pros-and-cons/${this.endpoints[this.currentEndpointIndex]}?page=${
        this.page
      }&per_page=${this.perPage}`;
      $.get(url)
        .done(response => {
          // Check if we have exhausted all endpoints
          if (this.currentEndpointIndex >= this.endpoints.length - 1) {
            // No more endpoints so hide the loading placeholder
            this.isLoading = false;
            // Display a message to user that there are no more services to display
            this.endOfServices = true;
          } else if (response.length < this.perPage) {
            // If fewer items in response then perPage we have exhausted this endpoint
            // Reset the page count to 1
            this.page = 1;
            // Increment the current endpoint index to move to the next endpoint
            this.currentEndpointIndex = this.currentEndpointIndex + 1;
            // If there are 0 responses, Call loadServices again to load content from the next endpoint
            if (response.length === 0) {
              // No responses, so call loadServices again
              this.loadServices();
            }
          } else {
            // Otherwise just incremenet the page count
            this.page = this.page + 1;
          }
          // Hide loading placeholder
          this.isLoading = false;
          // Add the items to the existing array
          for (let service of response) {
            let existingService = this.services.find(
              indexService => indexService.id === service.id
            );
            if (existingService === undefined) {
              this.services.push(service);
            }
          }
          this.isLoading = false;
          resolve();
        })
        .fail(e => {
          reject(e);
        });
    });
  };
}

export default ReasonStore;
