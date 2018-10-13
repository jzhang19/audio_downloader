
(function(){

    // const url = "https://www.ximalaya.com/revision/play/album?albumId=5940471&pageNum=1&sort=-1&pageSize=30"
    const localhost = "http://localhost:3000";
    var url = '';
    var albumId = '';
    var pageNum = '';
    var target = null;
    var path = '';
    var data = null;
    var playlist = [];
    var $table = null;

    $( document ).ready(function() {

        $table = $('#playlist');

        $('#availableAlbums').on('click', function(e){
            target = e.target || e.srcElement;
            $("#albumId").val($(target).text());
        });

        $('#getList').on('click', function(){
            if($("#playlist tbody")){
                $("#playlist tbody").empty();
            }

            url = $('#url').val();
            albumId = $('#albumId').val();
            pageNum = parseInt($('#pageNum').val(), 10);
            pageNumTo = $('#pageNumTo').val() ? parseInt($('#pageNumTo').val(), 10) : "";

            var allPlayList = [];
            var promiseList = [];
            if(pageNumTo) {
                for(var i = pageNum; i < pageNumTo + 1; i++) {
                    path = url + '?albumId=' + albumId + '&pageNum=' + i + '&sort=-1&pageSize=30';
                    var deferred = $.ajax(path, {
                        success: function(data) {
                            allPlayList.push(data);
                        }
                    });
                    promiseList.push(deferred);
                }

                $.when.apply($, promiseList).then(function() {
                    playlist = [];
                    for(var i = 0; i < allPlayList.length; i++) {
                        playlist = playlist.concat(allPlayList[i].data.tracksAudioPlay);
                    }
                    var tbody = $('<tbody/>');
                    for (var i = 0; i < playlist.length; i++) {
                        var tr = $('<tr/>').appendTo(tbody);
                        tr.append('<td>' + playlist[i]['albumId'] + '</td>');
                        tr.append('<td>' + playlist[i]['albumName'] + '</td>');
                        tr.append('<td class="trackName">' + playlist[i]['trackName'] + '</td>');
                        tr.append('<td class="src">' + playlist[i]['src'] + '</td>');
                        tr.append('<td><button type="button">Download</button></td>');
                    }
                    $table.append(tbody);
    
                    if($("#playlist tbody")){
                        $('#playlist tbody').on('click', 'button', function(){
                            var trackName = $(this).closest('tr').find('.trackName').text();
                            for(var j = 0; j < playlist.length; j++) {
                                if(playlist[j].trackName === trackName){
                                    download(playlist[j]);
                                }
                            }
                        });
                    }
                });
            } else {
                path = url + '?albumId=' + albumId + '&pageNum=' + pageNum + '&sort=-1&pageSize=30';
                $.getJSON(path, function(response){
                    data = response.data;
                    playlist = data.tracksAudioPlay;
                    console.log(playlist);
    
                    var tbody = $('<tbody/>');
                    for (var i = 0; i < playlist.length; i++) {
                        var tr = $('<tr/>').appendTo(tbody);
                        tr.append('<td>' + playlist[i]['albumId'] + '</td>');
                        tr.append('<td>' + playlist[i]['albumName'] + '</td>');
                        tr.append('<td class="trackName">' + playlist[i]['trackName'] + '</td>');
                        tr.append('<td class="src">' + playlist[i]['src'] + '</td>');
                        tr.append('<td><button type="button">Download</button></td>');
                    }
                    $table.append(tbody);
    
                    if($("#playlist tbody")){
                        $('#playlist tbody').on('click', 'button', function(){
                            var trackName = $(this).closest('tr').find('.trackName').text();
                            for(var j = 0; j < playlist.length; j++) {
                                if(playlist[j].trackName === trackName){
                                    download(playlist[j]);
                                }
                            }
                        });
                    }
                });
            }
        });

        $('#downloadAll').on('click', function(){
            console.log("All");
            downloadAll(playlist);
        });

        function download(one) {
            var postData = {
                "play": one
            };
            $.ajax({
                type: "POST",
                url: localhost + "/download",
                data: postData,
                success: function(data){
                    console.log("Success");
                },
                dataType: "json"
            });
        };
        
        function downloadAll(all) {
            var postData = {
                "playlist": playlist
            };
            $.ajax({
                type: "POST",
                url: localhost + "/downloadAll",
                data: JSON.stringify(postData),
                success: function(data){
                    console.log("Success");
                },
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
            });
        };
    });
})();
