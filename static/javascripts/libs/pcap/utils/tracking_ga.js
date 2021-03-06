(function() {
  // global variables
  var host = window.location.host,
    PCAP = window.PCAP || {};

  PCAP.GA = {};

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  // Tracking visit ids in Analytics allows to follow a specific visit from start to end
  PCAP.GA.getVisitId = function() {
    //check whether we have a visit cookie
    var cName = "gaVisitId",
      r,
      visitId = (r = RegExp(
        "(^|; )" + encodeURIComponent(cName) + "=([^;]*)"
      ).exec(document.cookie))
        ? r[2]
        : null;

    //if we do not have a cookie, set one
    if (visitId === null) {
      var expiryDate = new Date(),
        minutesToExpire = 30,
        visitId =
          new Date().getTime() +
          "." +
          Math.random()
            .toString(36)
            .substring(5);

      expiryDate.setTime(expiryDate.getTime() + minutesToExpire * 60 * 1000);

      // set cookie
      document.cookie =
        cName +
        "=" +
        visitId +
        "; expires=" +
        expiryDate.toUTCString() +
        "; path=/";
    }
    return visitId;
  };

  // MARKET-3045: handle GCLID
  //
  PCAP.GA.getGCLID = function() {
    var gCLID = getParameterByName("gclid"),
      returnValue;

    if (gCLID !== "") {
      returnValue = gCLID;
    } else {
      returnValue = "";
    }

    return returnValue;
  };

  //GA tracking code
  try {
    PCAP.GA.property = "UA-35405270-1";

    if (host.indexOf("www-devtrunk") > -1 || host.indexOf("local") > -1) {
      PCAP.GA.property = "UA-25424568-2";
    }

    // Universal Analytics code
    (function(i, s, o, g, r, a, m) {
      i["GoogleAnalyticsObject"] = r;
      (i[r] =
        i[r] ||
        function() {
          (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(
      window,
      document,
      "script",
      "https://www.google-analytics.com/analytics.js",
      "ga"
    );

    ga("create", PCAP.GA.property, "auto", { siteSpeedSampleRate: 50 });
    ga("require", "linkid");
    ga("require", "displayfeatures");

    ga("require", "GTM-WPB99M5");

    ga(function(tracker) {
      ga("set", "dimension1", tracker.get("clientId"));
      ga("set", "dimension4", new Date().getTime().toString());
      ga("set", "dimension6", window["_pcap_mbc"]);
      ga("set", "dimension9", PCAP.GA.getVisitId());
      ga("set", "dimension10", PCAP.GA.getGCLID());

      if (typeof _pageName === "undefined") {
        ga("send", "pageview");
      } else {
        ga("send", "pageview", _pageName);
      }
    });
  } catch (e) {
    //ga exception
  }

  window.PCAP = PCAP;
})();
