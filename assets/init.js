/*jslint vars: true, undef: true, browser: true, plusplus: true, indent: 2 */
/*global jQuery, $, Modernizr, Placeholder, window, Lectric, helpers, methods */

/* ============================================================================
   log('inside coolFunc', this, arguments);
   paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
   ========================================================================= */

window.log = function () {

  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }

};

// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());



/* ============================================================================
   Global elements and variables
   ========================================================================= */

var objElements = {

  $html: null,
  $window: null,
  $body: null,
  $slideshow: null,

  init: function () {
    objElements.$html = $("html");
    objElements.$window = $(window);
    objElements.$body = $("body");
  }

};

/* Detect top level directory to do some language-conditional changes later */
var dir = document.location.pathname.substring(1,document.location.pathname.indexOf("/",1)) ;


/* ============================================================================
   Globals
   ========================================================================= */

var objGlobals = {

  /**
   * Initialization
   */
  init: function () {

    log("** objGlobals.init **");

    // Assign references to elements
    objElements.init();

    // Global inits
    objGlobals._InitSocial();
    objGlobals._InitContact();

    // Navigation
    objNavigation.init();

    // Home
    objHome.init();

    // About
    objAbout.init();

    // Section Home
    objSectionHome.init();

    // Tabs
    objSectionTabs.init();

    // Sub page slideshow
    objSubPageSlideshow.init();

    // Smooth scroll for links on same page for .intro section
    $(".intro").localScroll();
    
  },



  /**
   * Set up Social media
   */
  _InitSocial: function () {

    log("** objGlobals.init > _InitSocial **");

    // Show only the first press release for pages other than the home page (.theme-default)
    // $(".theme-government .social-press .social-home-item, .theme-banks .social-press .social-home-item, .theme-enterprise .social-press .social-home-item, .theme-telecom .social-press .social-home-item, .theme-transport .social-press .social-home-item, .theme-m2m .social-press .social-home-item").filter(":gt(0)").addClass("hidden");
    $(".social-press .social-home-item").filter(":gt(1)").addClass("hidden");
    $(".social-updates .social-home-item").filter(":gt(1)").addClass("hidden");
    $(".social-events .social-home-item").filter(":gt(1)").addClass("hidden");
    $(".press-releases .social-home-item").filter(":gt(4)").addClass("hidden");   // Investors page

    // Show more items
    $("body").on("click", ".js-social-more", function (e) {

      // Prevent event bubbeling
      e.preventDefault();

      // Slide out items
      var socialHeight = 0;

      $(".social-item").each(function () {
        socialHeight += $(this).outerHeight();
      });

      $(".social").animate({
        'height' : socialHeight
      }, 500);

      // Set image
      var hideImage = "/images/social-hide.png";
      if (dir == "france") hideImage = "/france/images/social-hide_FR.gif";
      if (dir == "brasil") hideImage = "/brasil/images/social-hide_PT.gif";
      if (dir == "deutschland") hideImage = "/deutschland/images/social-hide-DE.gif";
      $(".social-more").find("img").attr("src", hideImage);
      
      // Set correct helper classes
      $(".social").toggleClass("is-collapsed").toggleClass("is-expanded");
      $(".social-more").toggleClass("js-social-more").toggleClass("js-social-less");

    });


    // Hide items
    $("body").on("click", ".js-social-less", function (e) {

      // Prevent event bubbeling
      e.preventDefault();

      // Hide items
      var socialHeight = "110px";

      $(".social").animate({
        'height' : socialHeight
      }, 500);

      // Set image
      var showImage = "/images/social-show.png";
      if (dir == "france") showImage = "/france/images/social-show_FR.gif";
      if (dir == "brasil") showImage = "/brasil/images/social-show_PT.gif";
      if (dir == "deutschland") showImage = "/deutschland/images/social-show-DE.gif";
      $(".social-more").find("img").attr("src", showImage);
      
      // Set correct helper classes
      $(".social").toggleClass("is-collapsed").toggleClass("is-expanded");
      $(".social-more").toggleClass("js-social-more").toggleClass("js-social-less");

    });


    // Show more small items on home page
    $("body").on("click", ".js-social-home-show", function (e) {

      // Prevent event bubbeling
      e.preventDefault();

      $(".social-home-item").fadeIn(200);
      $(".social-navigation").slideDown();
      $(".social-home-more").hide();
      $(".social-home-less").show();
    });

    $("body").on("click", ".js-social-home-hide", function (e) {

      // Prevent event bubbeling
      e.preventDefault();

      $(".social-press .social-home-item").filter(":gt(1)").slideUp();
      $(".social-updates .social-home-item").filter(":gt(1)").slideUp();
      $(".social-events .social-home-item").filter(":gt(1)").slideUp();
      // $(".social-navigation").slideUp();   // Makes all PRs disappear
      $(".social-home-more").show();
      $(".social-home-less").hide();
    });

  },



  /**
   * Contact form
   */
  _InitContact: function () {

    log("** objGlobals.init > _InitContact **");

    $('.contact-error').hide();
    var contactHide = "/_dotcom_template/images/contact-hide.png";
    var contactShow = "/_dotcom_template/images/contact-show.png";
    if (dir == "brasil") {
      contactHide = "/brasil/images/contact-hide_PT.png";
      contactShow = "/brasil/images/contact-show_PT.png";
    }
    if (dir == "france") {
      contactHide = "/france/images/contact-hide_FR.png";
      contactShow = "/france/images/contact-show_FR.png";
    }
    if (dir == "deutschland") {
      contactHide = "/deutschland/images/contact-hide-DE.png";
      contactShow = "/deutschland/images/contact-show-DE.png";
    }

    // Slide down
    $("body").on("click", ".js-contact-show", function (e) {

      e.preventDefault();

      $(".js-contact-form").slideDown();
      $(".js-contact-show").addClass("js-contact-hide").removeClass("js-contact-show").attr("src", contactHide );

    });

    // Slide up
    $("body").on("click", ".js-contact-hide", function (e) {

      e.preventDefault();

      $(".js-contact-form").slideUp();
      $(".js-contact-hide").addClass("js-contact-show").removeClass("js-contact-hide").attr("src", contactShow );

    });
    
    // Open form by default
    $(".js-contact-show").click();

    // Process form
    $("body").on("click", "input#contact-submit", function (e) {

      e.preventDefault();

      // validate and process form here
      $('.contact-error').hide();
      // return frmContactUs_Validation(document.frmContact); // validation done by external .js
      var region = $("select#contact-region").val();
      if (region == "0") {
        $("label#contact-region-error").show();
        $("select#contact-region").focus();
        return false;
      }

      var surname = $("input#contact-surname").val();
      if (surname === "") {
        $("label#contact-surname-error").show();
        $("input#contact-surname").focus();
        return false;
      }

      var email = $("input#contact-email").val();
      if (email === "") {
        $("label#contact-email-error1").show();
        $("input#contact-email").focus();
        return false;
      }
      if (!validateEmail(email)) {
        $("label#contact-email-error2").show();
        $("input#contact-email").focus();
        return false;
      }

      var request = $("textarea#contact-message").val();
      if (request === "") {
        $("label#contact-message-error").show();
        $("textarea#contact-message").focus();
        return false;
      }

      var dataString = 'fTitle=' + $("select#contact-title").val();
      dataString += '&fSurname=' + $("input#contact-surname").val();
      dataString += '&fFirstname=' + $("input#contact-firstname").val();
      dataString += '&fEmail=' + $("input#contact-email").val();
      dataString += '&fTel=' + $("input#contact-telephone").val();
      dataString += '&fCompanyName=' + $("input#contact-company").val();
      dataString += '&fCompanyWebSite=' + $("input#contact-companyweb").val();
      dataString += '&fRegion=' + $("select#contact-region").val();
      dataString += '&fBusiness=' + $("input#contact-business").val();
      dataString += '&fRequest=' + $("textarea#contact-message").val();
      //alert (dataString);return false;

      $.ajax({
        type: "POST",
        url: "/php/contactus.php",
        data: dataString,
        success: function () {
          $('.js-contact-form').html("<div id='message' style='height: 518px'></div>");
          $('#message').html("<h2 style='clear: none; margin-top:0'>Contact Form Submitted!</h2><p>We will be in touch soon.</p>")
          .hide()
          .fadeIn(500, function () {
            $('#message').animate({
              height: "107px"
            }, 500);
          });
        }
      });
    });

  },



  /**
   * Validates forms site-wide. See the jquery.validation script for options.
   */
  _InitFormValidation: function () {
    // $("form").ValidateForm();
  }

};



/* ============================================================================
   Navigation
   ========================================================================= */

var objNavigation = {

  /**
   * Initialization
   */
  init: function () {

    log("** objNavigation **");

    // Header navigation
    $("#js-header-nav").on('mouseenter', 'li', function () {
      var currentElement = $(this);
      
      /* Use Solutions big drop down */
      if (currentElement.attr("class") == "use-large-sub-nav") {
        $("#js-header-nav-sub").addClass("use-large-sub-nav");
      } else {
        $("#js-header-nav-sub").removeClass("use-large-sub-nav");
      }

      /* Position About */
      if (currentElement.attr("class") == "nav-about") {
        $("#js-header-nav-sub").addClass("nav-about");
      } else {
        $("#js-header-nav-sub").removeClass("nav-about");
      }

      /* Position Contact us */
      if (currentElement.attr("class") == "nav-contact-us") {
        $("#js-header-nav-sub").addClass("nav-contact-us");
      } else {
        $("#js-header-nav-sub").removeClass("nav-contact-us");
      }

      $(".nav-info-default").show();

      if (currentElement.find('ul').length > 0) {
        $("#js-header-nav-sub").show();
        $("#js-header-nav-sub ul").html(currentElement.find('ul').html());
        $("#js-header-nav-sub > .nav-info").html('');

        var elementMarker      = $("#js-header-nav-sub").find('.element-marker');
        var elementWidth       = currentElement.outerWidth();
        var elementLeft        = currentElement.offset().left;
        var elementMarkerWidth = elementMarker.outerWidth() / 2;
        var navPosition        = elementLeft - $("#js-header-nav-sub").offset().left - elementMarkerWidth + (elementWidth / 2);
        elementMarker.css('left', navPosition + 'px');
      } else {
        $("#js-header-nav-sub").hide();
      }

    });

    $("body").on('mouseleave', '#js-header-nav-sub, .container nav', function (e) {
      $("#js-header-nav-sub").hide();
    });

    $("body").on('mouseenter', '#js-header-nav-sub', function () {
      $("#js-header-nav-sub").show();
    });

    // Header sub navigation
    $("#js-header-nav-sub").on('mouseenter', 'a', function () {
      var currentElement = $(this);
      $(".nav-info-default").hide();

      $("#js-header-nav-sub li").removeClass('hover');
      currentElement.parent("li").addClass('hover');

      $("#js-header-nav-sub > .nav-info").html(currentElement.parent("li").find('.nav-info').html());
    });

  }

};



/* ============================================================================
   Home
   ========================================================================= */

var objHome = {

  /**
   * Initialization
   */
  init: function () {

    log("** objHome.init **");

    $(".header-home-box").show();

    /**
     * Top background fade and scroller
     */

    if ($("#js-header-home-boxes").length > 0)
    {

      $("#js-home-header-images").find(".home-header-image:not(':first')").hide();

      // Get images and texts in normal order
      var homeSlideImages     = $("#js-home-header-images div");
      var homeSlideImagesCopy = $("#js-home-header-images div");
      var homeSlideTexts      = $("#js-header-home-boxes .header-home-box");
      var homeSlideTextsCopy  = $("#js-header-home-boxes .header-home-box");
      // Ramdomize order
      homeSlideImages = homeSlideImages.sort(function() {
        return Math.round( Math.random() ) - 0.5;
      });
      homeSlideImages.each(function(index, element) {
        var random = $(element).data("index");
        homeSlideImages[index] = homeSlideImagesCopy[random];
        homeSlideTexts[index]  = homeSlideTextsCopy[random];
      });
      // Add images in new sort order to the DOM
      $("#js-home-header-images").html(homeSlideImages);
      $("#js-home-header-images div").removeClass("current-item").hide();
      $("#js-home-header-images div:first-child").addClass("current-item").show();
      // Add texts in new sort order and reattach scrubber to the DOM
      var homeScrubber = $("#home-scrubber");
      $("#js-header-home-boxes").html(homeSlideTexts).append(homeScrubber);


      // Set width and position of the scrubber
      $("#home-scrubber").css({
        width: $("#home-scrubber").find('.item').length * $("#home-scrubber").find('.item:first').width()
      });

      // Slider
      var slider = new Lectric();
      slider.init('#js-header-home-boxes', {
        itemClassName : 'header-home-box',
        next: '.home-header-image-next',
        previous: '.home-header-image-previous'
      });
      $(slider.opts.previous).hide();

      var scale = slider.itemWidth() / $("#home-scrubber").find('.item:first').width();
      var count = 1;
      var lastPosition = 0;
      var timer = setInterval(function() {
        count = (count < slider.itemCount()) ? count : 0;
        slider.to(count);
      }, 7000);

      // Scrubber
      var scrubber = new Lectric();
      scrubber.init('#home-scrubber', {reverse: true});

      // Slide function
      slider.subscribe('slide', function (s, event) {

        scrubber.position.x = -slider.position.x / scale;
        scrubber.update({
          triggerSlide: false
        });

        var currentItem = $("#js-home-header-images").find(".home-header-image.current-item");
        var nextItem = null;

        if (lastPosition <= s.position.x) {
          // Previous
          count = (count > 1) ? count - 1 : 1;
          if (count === 1) {
            nextItem = $("#js-home-header-images").find(".home-header-image:first-child");
          } else {
            nextItem = (currentItem.prev().length > 0) ? currentItem.prev() : null;
          }
        } else {
          // Next
          count = (count < slider.itemCount()) ? count + 1 : slider.itemCount();
          nextItem = (currentItem.next()) ? currentItem.next() : null;
        }

        // Hide and show next/previous buttons
        $(slider.opts.previous).show();
        $(slider.opts.next).show();
        if (count === 1)
        {
          $(slider.opts.previous).hide();
        }

        if (count === $('#js-header-home-boxes').find('.item').length)
        {
          $(slider.opts.next).hide();
        }

        lastPosition = s.position.x;
        if (nextItem === null) {
          return;
        }

        currentItem.removeClass('current-item');
        nextItem.addClass('current-item');

        nextItem.fadeIn();
        currentItem.fadeOut();
      });

      // Scrubber function
      scrubber.subscribe('slide', function () {
        slider.position.x = -scrubber.position.x * scale;
        slider.update({triggerSlide: false});
      });

      // keyboard shortcuts for left and right arrows
      $(document).keydown(function(e) {
        if (e.keyCode === 39) {
          e.preventDefault();
          var previous = slider.page();
          slider.to(previous + 1);
        } else if (e.keyCode === 37) {
          e.preventDefault();
          var previous = slider.page();
          slider.to(previous - 1);
        }
        clearInterval(timer);
        slider.unsubscribe(e.type, e.handler);
      });

      // clear the interval if we touch the slider for the first time
      // or tap one the next or previous buttons
      var clearIt = function(s, e) {
        clearInterval(timer);
      };
      slider.subscribe('start', clearIt);
      slider.subscribe('previousButton', clearIt);
      slider.subscribe('nextButton', clearIt);

      // pre load images
      preloadImages = [
        '/_dotcom_template/images/home-top-2.jpg',
        '/_dotcom_template/images/home-top-3.jpg',
        '/_dotcom_template/images/home-top-4.jpg'
      ];
      $(preloadImages).each(function () {
        (new Image()).src = this;
      });

    }

  }

};



/* ============================================================================
   About
   ========================================================================= */

var objAbout = {

 /**
  * Initialization
  */
  init: function () {

    log("** objAbout.init **");

    var firstRowOrgHeight = 0;

    $('body').on('click', 'a.box-about', function (e) {
      e.preventDefault();

      var box       = $(this);
      var col       = box.attr('rel');
      var childNode = box.closest('.boxes-about').find('.' + col);
      var firstNode = box.closest('.boxes-about').find('.first');

      if (firstRowOrgHeight === 0) {
        firstRowOrgHeight = firstNode.height();
      }

      if (box.hasClass('open')) {
        childNode.slideUp();
        firstNode.animate({'height': firstRowOrgHeight + 'px'});
        box.removeClass('open');
        box.find('.arrow-up-color').removeClass('arrow-up-color').addClass('arrow-down-color');
      } else {

        // Reset all others
        var openedBox = $('.box-about.open');
        var doAnimation = true;
        if (openedBox.length > 0) {


          openedBox.removeClass('open');
          openedBox.find('.arrow-up-color').removeClass('arrow-up-color').addClass('arrow-down-color');
          if (openedBox.closest('.boxes-about').index() === box.closest('.boxes-about').index()) {
            $('.boxes-about').find('.box-about-sub').hide();
            childNode.show();
            doAnimation = false;
            box.find('.arrow-down-color').removeClass('arrow-down-color').addClass('arrow-up-color');

          } else {
            $('.boxes-about').find('.box-about-sub').slideUp();
            $('.box-about.first').css({'height': firstRowOrgHeight + 'px'});
          }
        }

        box.addClass('open');
        if (doAnimation === true) {
          childNode.slideDown();
          firstNode.animate({'height': '300px'});
          box.find('.arrow-down-color').removeClass('arrow-down-color').addClass('arrow-up-color');
        }
      }
    });

  }

};



/* ============================================================================
   Section Home
   ========================================================================= */

var objSectionHome = {

  /**
   * Initialization
   */
  init: function () {

    log("** objSectionHome.init **");


    /**
    * Fold out entrance if hash is set
    */
    var url = window.location.href.split("#");

    if (url.length > 1) {

      var id  = $("#" + url[1]).parent(".entrance"),
          elm = $(id).siblings(".entrance-tab");

      // If animation class = "background-scale"
      if ($(id).hasClass("background-scale")) {

        // Fallback for IE <= 8
        if ($.browser.msie && $.browser.version <= 8) {

          var backgroundImage = $(id).css("background-image").slice(0, -6) + '-fb.jpg")';

          $(id).css("background-image", backgroundImage);
          $(id).css("background-position", "100% 0");

        } else {

          $(id).animate({
            'background-position'  : "(" + $(id).attr("data-end-x") + " " + $(id).attr("data-end-y") + ")",
            'background-size'      : $(id).attr("data-end-size"),
            '-moz-background-size' : $(id).attr("data-end-size")
          }, 500);

        }

        // Find right .is-collapsed element and slide down
        $(id).slideDown(function () {
          $("html,body").animate({scrollTop: $(id).offset().top}, 1000);
        });

        // Remove .is-collapsed from container
        $("#" + url[1]).removeClass("is-collapsed").addClass("is-expanded");

        // Change tab action
        $("#" + url[1]).siblings(".entrance-tab").removeClass("js-read-more").addClass("js-read-less");

        // Change tab icon
        $("#" + url[1]).siblings(".entrance-tab").find(".icon").removeClass("arrow-down").addClass("arrow-up");

      }

    }


    /**
     * Fold out entrances
     */
    $("body").on("click", ".js-read-more", function (e) {

      // Set hash in URL
      url = window.location.href.split("#");
      if (url.length > 0) {
        window.location.href = url[0] + $(this).find("a").attr("href");
      }

      // Prevent event bubbeling
      e.preventDefault();

      // Get elements
      var id  = $(this).parent(".entrance"),
          elm = $(this).find("a");

      // If animation class = "background-scale"
      if ($(id).hasClass("background-scale")) {

        // Fallback for IE <= 8
        if ($.browser.msie && $.browser.version <= 8) {

          var backgroundImage = $(id).css("background-image").slice(0, -6) + '-fb.jpg")';

          $(id).css("background-image", backgroundImage);
          $(id).css("background-position", "100% 0");

        } else {

          $(id).animate({
            'background-position'  : "(" + $(id).attr("data-end-x") + " " + $(id).attr("data-end-y") + ")",
            'background-size'      : $(id).attr("data-end-size"),
            '-moz-background-size' : $(id).attr("data-end-size")
          }, 500);

        }

      }

      // Find right .is-collapsed element and slide down
      $(this).siblings(".is-collapsed").slideDown(function () {
        $("html,body").animate({scrollTop: $(id).offset().top}, 1000);
      });

      // Remove .is-collapsed from container
      $(this).siblings(".is-collapsed").removeClass("is-collapsed").addClass("is-expanded");

      // Change tab action
      $(elm).parent(".entrance-tab").removeClass("js-read-more").addClass("js-read-less");

      // Change tab icon
      $(elm).find(".icon").removeClass("arrow-down").addClass("arrow-up");

    });


    /**
     * Fold in entrances
     */
    $("body").on("click", ".js-read-less", function (e) {

      // Prevent event bubbeling
      e.preventDefault();

      // Get elements
      var id  = $(this).parent(".entrance"),
          elm = $(this).find("a");

      // Background animation - Scale
      if ($(id).hasClass("background-scale")) {

        // Fallback for IE <= 8
        if ($.browser.msie && $.browser.version <= 8) {

          var backgroundImage = $(id).css("background-image").slice(0, -9) + '.jpg")';

          $(id).css("background-image", backgroundImage);
          $(id).css("background-position", $(id).attr("data-start-x") + " " + $(id).attr("data-start-y"));

        } else {

          $(id).animate({
            'background-position'  : "(" + $(id).attr("data-start-x") + " " + $(id).attr("data-start-y") + ")",
            'background-size'      : $(id).attr("data-start-size"),
            '-moz-background-size' : $(id).attr("data-start-size")
          }, 500);

        }
      }

      // Collapse
      $(this).siblings(".is-expanded").slideUp(function () {
        // Slide up
        // $("html,body").animate({scrollTop: $(id).offset().top}, 500);
      });

      // Remove .is-expanded from container
      $(this).siblings(".is-expanded").removeClass("is-expanded").addClass("is-collapsed");

      // Change tab action
      $(elm).parent(".entrance-tab").removeClass("js-read-less").addClass("js-read-more");

      // Change tab icon
      $(elm).find(".icon").removeClass("arrow-up").addClass("arrow-down");

    });


    // YouTube
    $("body").on("click", ".youtube", function (e) {
      e.preventDefault();
      $(this).hide();
      $(this).next("iframe").show();
    });


    // Follow & Contact smooth scroll
    $("body").on("click", ".intro-cta-text-aligned a, .sub-entrances a", function (e) {
      e.preventDefault();
      // Get elements
      var elm = $(this).attr('href');
      if (elm.substr(0,1) == '#') {
        elm = elm.substr(1);
        // var elm = "hash";
        // alert("Click on " + elm);

        $("html,body").animate({scrollTop: $("a[name='" + elm + "']").offset().top}, 2000);
      }
      else {
        window.location.href = elm;
      }
    });

  }

};



/* ============================================================================
   Tabs
   ========================================================================= */

var objSectionTabs = {

  /**
   * Initialization
   */
  init: function () {

    log("** objSectionTabs.init **");

    var tabCount = $('.tabs').length;

    if (tabCount === 0) {
      return;
    }

    $('.tabs').each(function (downloadIndex) {
      var currentH2   = $(this).find('h2'),
          currentH2Id = "";

      currentH2.hide();

      if (currentH2.attr("id")) {
        currentH2Id = currentH2.attr("id");
      }

      if (downloadIndex !== 0) {
        $(this).hide();
      } else {
        $(this).before('<ul id="js-downloads-tabs" class="tabs-headings"></ul>');
      }

      var liClass = (downloadIndex === 0) ? 'first current tab-' + tabCount : 'tab-' + tabCount;

      $('#js-downloads-tabs').append('<li class="' + liClass + '"><a href="#" id="' + currentH2Id + '" class="tabs-headings-item">' + currentH2.html() + '</a></li>');
    });


    $('.sub-content').on('click', '.tabs-headings-item', function (e) {

      e.preventDefault();

      // Set hash in URL
      url = window.location.href.split("#");
      if (url.length > 0) {
        if (window.history.pushState) {
          window.history.pushState("", document.title, url[0] + "#" + $(this).attr("id"));
        }
      }

      var clickedItem = $(this);

      if (clickedItem.closest('li').hasClass('current')) {
        return;
      }

      $('.tabs-headings-item').closest('li').removeClass('current');
      clickedItem.closest('li').addClass('current');

      $('.tabs').hide();

      var currentItem = $('.tabs').eq(clickedItem.closest('li').index());
      currentItem.show();

      $("#js-downloads-tabs").find('li').removeClass('no-radius');
      if (clickedItem.closest('li').prev('li').length > 0) {
        clickedItem.closest('li').prev('li').addClass('no-radius');
      }

    });


    /**
     * Show more items on event Tabs
     */
    $("body").on("click", ".js-events-show", function (e) {

      // Prevent event bubbeling
      e.preventDefault();

      $(this).parents(".tabs").find(".tabs-item.event").fadeIn(200);
      $(this).parents(".tabs").find(".events-more").hide();
      $(this).parents(".tabs").find(".events-less").show();
    });

    $("body").on("click", ".js-events-hide", function (e) {

      // Prevent event bubbeling
      e.preventDefault();

      $(this).parents(".tabs").find(".tabs-item.event:nth-child(n+4)").fadeOut(100);
      $(this).parents(".tabs").find(".events-more").show();
      $(this).parents(".tabs").find(".events-less").hide();
    });


    /**
     * Open tab in URL hash
     */
    var url = window.location.href.split("#");

    if (url.length > 1) {

      $("html,body").animate({scrollTop: 100}, 1000);

      var clickedItem = $("#" + url[1]);
      if (clickedItem.closest('li').hasClass('current')) {
        return;
      }

      $('.tabs-headings-item').closest('li').removeClass('current');
      clickedItem.closest('li').addClass('current');

      $('.tabs').hide();

      var currentItem = $('.tabs').eq(clickedItem.closest('li').index());
      currentItem.show();

      $("#js-downloads-tabs").find('li').removeClass('no-radius');
      if (clickedItem.closest('li').prev('li').length > 0) {
        clickedItem.closest('li').prev('li').addClass('no-radius');
      }

    }


  }

};



/* ============================================================================
   Sub page Slideshow
   ========================================================================= */

var objSubPageSlideshow = {

  /**
   * Initialization
   */
  init: function () {

    log("** objSubPageSlideshow.init **");

    if ($("#js-sub-page-slideshow-images").length > 0) {

      // hide texts
      $("#js-sub-page-slideshow-texts").find(".sub-page-slideshow-text:not(':first')").hide();

      // init slider
      var slider = new Lectric();
      slider.init('#js-sub-page-slideshow-images', {
        itemClassName : 'sub-page-slideshow-image',
        next: '.sub-page-slideshow-next',
        previous: '.sub-page-slideshow-previous'
      });

      // hide previous button
      $(slider.opts.previous).hide();

      // on each slide
      slider.subscribe('animationEnd', function (s, event) {

        // hide/show previous and next buttons
        if (slider.page() === 0) {
          $(slider.opts.previous).hide();
        }
        if (slider.page() > 0) {
          $(slider.opts.previous).show();
        }
        if (slider.page() < slider.itemCount() - 1) {
          $(slider.opts.next).show();
        }
        if (slider.page() === slider.itemCount() - 1) {
          $(slider.opts.next).hide();
        }

        // show/hide correct text
        $("#js-sub-page-slideshow-texts").children(".sub-page-slideshow-text").hide();
        $("#js-sub-page-slideshow-texts").children(":nth-child(" + (slider.page() + 1) + ")").fadeIn();

        // highlight correct list item indicator
        $(".sub-page-slideshow .indicator li").removeClass("current");
        $(".sub-page-slideshow .indicator").children(":nth-child(" + (slider.page() + 1) + ")").addClass("current");

      });

    }

  }

};




/* ============================================================================
   Old functions that we still need after July 2012
   ========================================================================= */

// The set_height() function is called to make all the columns of the layout
// occupy the same space. It measures the biggest column, then sets the height
// for the containing block, forcing a recalculation of the child divs.
// Tested for Firefox IE7 and IE6.
function set_height() {

}

// jumpMenu is called by the pulldown menu to switch to a regional site
function MM_jumpMenu(targ, selObj, restore) { //v3.0
  eval(targ + ".location='" + selObj.options[selObj.selectedIndex].value + "'");
  if (restore) selObj.selectedIndex = 0;
}



/* ============================================================================
   Only one document.ready() event calls objGlobals.init method
   ========================================================================= */

$(function () {
  objGlobals.init();
});
