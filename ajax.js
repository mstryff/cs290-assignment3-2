function favorite(description, url){
    this.description = description;
    this.url = url;
}


window.onload = function(){
    //window.localStorage.clear();
    var favoritesStr = localStorage.getItem('favorites');
    if(favoritesStr === null){
        favorites = {'faveGists':[]};
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    else{
        favorites = JSON.parse(localStorage.getItem('favorites'));
    }
    
    for(var i = 0; i < favorites.faveGists.length; i++){
        var description = favorites.faveGists[i].description;
        var url = favorites.faveGists[i].url;
        
        var faveList = document.getElementById("faves");
        var faveElement = document.createElement("li");
        var a = document.createElement("a");
        
        var removeButton = document.createElement("button");
        var removeButtonText = document.createTextNode("Remove from favorites");
        removeButton.appendChild(removeButtonText);
        removeButton.url = url;

        removeButton.onclick = function(url){
            removeFaves(this.url);
        }

        a.innerHTML = description;
        a.href = url;
        faveElement.appendChild(a);
        faveElement.appendChild(removeButton);
        faveElement.id = url;
        faveList.appendChild(faveElement);
    }
}


function searchGists(){
    var req = new XMLHttpRequest();
    if(!req){
        throw 'Unable to create HttpRequest.';
    }

    var url = 'https://api.github.com/gists';

    req.onreadystatechange = function(){
        if(this.readyState === 4){
            var gists = JSON.parse(this.responseText);
            var gistList = document.getElementById("results");
            
            while(gistList.firstChild){
                gistList.removeChild(gistList.firstChild);
            }
            
            var inFavorites;
            
            for(var i = 0; i < gists.length; i++){
                var inFavorites = false;
                var description = gists[i].description;
                var url = gists[i].url;
                
                if(description == "" || description == null){
                    description = "No description provided.";
                }
                
                for(var j = 0; j < window.favorites.faveGists.length; j++){
                    if(url == window.favorites.faveGists[j].url){
                        inFavorites = true;
                    }
                }
                
                if(!inFavorites){                
                    var gistElement = document.createElement("li");
                    var a = document.createElement("a");

                    var faveButton = document.createElement("button")
                    var faveButtonText = document.createTextNode("Add to favorites");
                    faveButton.appendChild(faveButtonText);
                    faveButton.desc = description;
                    faveButton.addr = url;

                    faveButton.onclick = function(){
                        addToFaves(this.desc, this.addr);
                    }

                    a.innerHTML = description;
                    a.href = url;
                    gistElement.appendChild(a);
                    gistElement.appendChild(faveButton);
                    gistElement.id = url;
                    gistList.appendChild(gistElement);
                }
            }
        }
    }

    req.open('GET', url);
    req.send();
}

function addToFaves(description, url){
    var resultList = document.getElementById("results");
    var toRemove = document.getElementById(url);
    resultList.removeChild(toRemove);
    
    var faveList = document.getElementById("faves");
    var faveElement = document.createElement("li");
    var a = document.createElement("a");
    
    var removeButton = document.createElement("button");
    var removeButtonText = document.createTextNode("Remove from favorites");
    removeButton.appendChild(removeButtonText);
    removeButton.url = url;
    
    removeButton.onclick = function(){
        removeFaves(this.url);
    }
    
    a.innerHTML = description;
    a.href = url;
    faveElement.appendChild(a);
    faveElement.appendChild(removeButton);
    faveElement.id = url;
    faveList.appendChild(faveElement);
    
    newFave = new favorite(description, url);
    
    window.favorites.faveGists.push(newFave);
    localStorage.setItem('favorites', JSON.stringify(window.favorites));
}


function removeFaves(url){
    var favoriteList = document.getElementById("faves");
    var toRemove = document.getElementById(url);
    favoriteList.removeChild(toRemove);
    
    var index = -1;
    
    for(var i = 0; i < window.favorites.faveGists.length; i++){
        if(window.favorites.faveGists[i].url == url)
            index = i;
    }
    
    if(index != -1){
        window.favorites.faveGists.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(window.favorites));
    }
    
}
