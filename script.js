$(document).ready(function () {
    // Initilization of the variables
    var $pagination = $("#pagination"),
      totalRecords = 0,
      records = [],
      recPerPage = 0,
      nextPageToken = "",
      totalPages = 0;
    var API_KEY = config.API_KEY;
    var search = "";
    var duration = "any";
    var order = "date";
    var beforedate = new Date().toISOString();
    var afterdate = new Date().toISOString();
    var maxResults=10
  
    $("#beforedate").val(beforedate)
    $("#afterdate").val(afterdate)

    // This function gets invoked whenever the beforeDate is changed
    $("#beforedate").change(function(){
        beforedate = new Date(this.val()).toISOString()
        $("#beforedate").val(beforedate)
        afterdate = new Date(this.val()).toISOString()
        $("#afterdate").val(afterdate)
    })

    // This function gets invoked whenever the afterDate is changed
    $("#afterdate").change(function(){
      afterdate = new Date(this.val()).toISOString()
      $("#afterdate").val(afterdate)
      beforedate = new Date(this.val()).toISOString()
      $("#beforedate").val(beforedate)
    })

    // This function gets triggered whenever the duration is changed
    $("#duration").change(function () {
      duration = $(this).children("option:selected").val();
    });
    
    // This function gets invoked when the user chanegs the order by which the videos should be fetched
    $("#order").change(function () {
      order = $(this).children("option:selected").val();
    });

    // Function which gets executed when the submit button is clicked
    $("#myForm").submit(function (e) {
      e.preventDefault();
      search = $("#search").val();
      console.log(beforedate);

      // Search url
      var url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}
          &part=snippet&q=${search}&maxResults=${maxResults}&publishedAfter=${afterdate}&publishedBefore=${beforedate}&order=${order}&videoDuration=${duration}&type=video`;

      // Getting the response of the Url
      $.ajax({
        method: "GET",
        url: url,
        beforeSend: function () {
          $("#btn").attr("disabled", true);
          $("#results").empty();
        },
        success: function (data) {
          console.log(data);
          $("#btn").attr("disabled", false);
          displayVideos(data);
        },
      });
    });

    // Function to apply pagination
    function apply_pagination() {
      $pagination.twbsPagination({
        totalPages: totalPages,
        visiblePages: 5,
        // Change on clicking the page number
        onPageClick: function (event, page) {
          console.log(event);
          // Getting the indexes between which the records should be displayed
          displayRecordsIndex = Math.max(page - 1, 0) * recPerPage;
          endRec = displayRecordsIndex + recPerPage;

          console.log(displayRecordsIndex + "ssssssssss" + endRec);
          displayRecords = records.slice(displayRecordsIndex, endRec);
          generateRecords(recPerPage, nextPageToken);
        },
      });
    }
    // Whenever the search query is changed this function gets triggered
    $("#search").change(function () {
      search = $("#search").val();
    });
    
    // Function to generate all the records 
    function generateRecords(recPerPage, nextPageToken) {
      var url2 = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}
      &part=snippet&q=${search}&maxResults=${maxResults}&pageToken=${nextPageToken}&publishedBefore=${beforedate}&publishedAfter=${afterdate}&order=${order}&videoDuration=${duration}&type=video`;
  
      $.ajax({
        method: "GET",
        url: url2,
        beforeSend: function () {
          $("#btn").attr("disabled", true);
          $("#results").empty();
        },
        success: function (data) {
          console.log(data);
          $("#btn").attr("disabled", false);
          displayVideos(data);
        },
      });
    }
    // Function to display all the videos from the search list
    function displayVideos(data) {
      recPerPage = data.pageInfo.resultsPerPage;
      nextPageToken = data.nextPageToken;
      console.log(records);
      totalRecords = data.pageInfo.totalResults;
      totalPages = Math.ceil(totalRecords / recPerPage);
      apply_pagination();
      $("#search").val("");
      var videoData = "";
      $("#table").show();

      // Showing all the data in the tabular format
      data.items.forEach((item) => {
        videoData = `<tr>
                        <td>
                            <a target="_blank" href="https://www.youtube.com/watch?v=${item.id.videoId}">
                            ${item.snippet.title}</td>
                        <td>
                            <img width="200" height="200" src="${item.snippet.thumbnails.high.url}"/>
                        </td>
                        <td>
                            <a target="_blank" href="https://www.youtube.com/channel/${item.snippet.channelId}">${item.snippet.channelTitle}</a>
                        </td>
                      </tr>`;
  
        $("#results").append(videoData);
      });
    }
  });