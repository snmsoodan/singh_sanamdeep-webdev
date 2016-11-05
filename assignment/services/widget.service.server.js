module.exports=function (app) {

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads'});
    var widgets=[
        { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/"},
        { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
        { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://youtu.be/AM2Ivdi9c4E" },
        { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
    ]

    app.get("/api/page/:pageId/widget",findAllWidgetsForPage);
    app.post("/api/page/:pageId/widget",createWidget);
    app.get("/api/widget/:widgetId",findWidgetById);
    app.put("/api/widget/:widgetId",updateWidget);
    app.delete("/api/widget/:widgetId",deleteWidget);
    app.put("/page/:pageId/widget", reorderWidget);
    app.post ("/api/uploads", upload.single('myFile'), uploadImage);

    function uploadImage(req, res) {
        console.log(req.body);
        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;
        var widgetId = req.body.widgetId;
        var width = req.body.width;
        var myFile = req.file;
        if (myFile == null) {
            res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
            return;
        }
        var originalname = myFile.originalname; // file name on user's computer
        var filename = myFile.filename;     // new file name in upload folder
        var path = myFile.path;         // full path of uploaded file
        var destination = myFile.destination;  // folder where file is saved to
        var size = myFile.size;
        var mimetype = myFile.mimetype;
        // res.send(200);
        for(var i in widgets){
            if(widgets[i]._id===widgetId){
                widgets[i].url="/uploads/"+filename;
            }
        }
        res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
    }

    function reorderWidget(req, res) {
        var pageId = req.params.pageId;
        var start = parseInt(req.query.start);
        var end =  parseInt(req.query.end);
        start = start;
        end = end;
        console.log("service")

        for(var i in widgets) {
            if(start< end){

                if(widgets[i].order === start){
                    widgets[i].order = end;
                    widgets[i].save();
                }
                else if(widget.order > start && widget.order <= end){
                    widgets[i].order--;

                    widgets[i].save();

                }
            } else{
                if(widgets[i].order === start){

                    widgets[i].order = end;
                    widgets[i].save();

                }

                else if(widgets[i].order < start && widgets[i].order >= end){

                    widgets[i].order++;

                    widgets[i].save();

                }
            }
        }
    }
    
    function deleteWidget(req,res) {
        var widgetId=req.params.widgetId;
        for(var i in widgets){
            if(widgets[i]._id===widgetId){
                widgets.splice(i,1);
                res.send(true);
                return;
            }
        }
        res.send(false);
        return;
    }
    
    function updateWidget(req,res) {
        var widgetId=req.params.widgetId;
        var widget=req.body;
        if(widget.widgetType=="HEADER"){
            for(var i in widgets){
                if(widgets[i]._id===widgetId){
                    widgets[i].size=widget.size;
                    widgets[i].text=widget.text;
                    widgets[i].name=widget.name;
                    res.send(true);
                    return;
                }
            }
            return false;
        }
        else if(widget.widgetType=="YOUTUBE"){
            for(var i in widgets){
                if(widgets[i]._id===widgetId){
                    widgets[i].width=widget.width;
                    widgets[i].text=widget.text;
                    widgets[i].name=widget.name;
                    widgets[i].url=widget.url;
                    res.send(true);
                    return;
                }
            }
            res.send(false);
            return;
        }
        else if(widget.widgetType=="IMAGE"){
            for(var i in widgets){
                if(widgets[i]._id===widgetId){
                    widgets[i].width=widget.width;
                    widgets[i].text=widget.text;
                    widgets[i].name=widget.name;
                    widgets[i].url=widget.url;
                    res.send(true);
                    return;
                }
            }
            res.send(false);
            return;
        }

        else if(widget.widgetType=="HTML"){
            for(var i in widgets){
                if(widgets[i]._id===widgetId){
                    widgets[i].text=widget.text;
                    res.send(true);
                    return;
                }
            }
            res.send(false);
            return;
        }
    }

    function findWidgetById(req,res) {
        var widgetId=req.params.widgetId;
        for(var i in widgets){
            if(widgets[i]._id===widgetId){
                res.send(widgets[i]);
                return;
            }
        }
        res.send(null);
        return;
    }
    
    function createWidget(req,res) {
        var newWidget=req.body;
        widgets.push(newWidget);
        res.send(newWidget);
    }
    
   function findAllWidgetsForPage(req,res) {
       var pageId=req.params.pageId;
       var resultset=[];
       for(var i in widgets){
           if(widgets[i].pageId===pageId){
               resultset.push(widgets[i]);
           }
       }
       res.send(resultset);
       return;
   }
};