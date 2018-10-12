
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
            pageNum = $('#pageNum').val();
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
                data: postData,
                success: function(data){
                    console.log("Success");
                },
                dataType: "json"
            });
        };
    });
})();
