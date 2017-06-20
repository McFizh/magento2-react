import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
        menuData: ""
    };
  }

  componentDidMount() {
    this.loadMenuAjax();
  }

  render() {
    return (
        <div className="">
            <div className="menu" dangerouslySetInnerHTML={{__html: this.state.menuData}}></div>
        </div>
    );
  }

  loadMenuAjax() {
    var xhr = new XMLHttpRequest();
    var objRef = this;

    xhr.open("GET","http://local.testikauppa/rest/V1/categories");

    xhr.onreadystatechange = function() { objRef.ajaxCallback(xhr); }
    xhr.send();
  }

  ajaxCallback(xhr) {
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        var data = JSON.parse( xhr.responseText );

        this.setState(
            { menuData: this.parseMenu( data.children_data ) }
        );
    }
  }

  parseMenu(menuData) {
    var retVal = "<ul>";

    for(let item of menuData) {
        if(!item.is_active)
            continue;
    
        retVal += "<li>"+item.name+"</li>";
        if (item.children_data && item.children_data.length > 0) {
            retVal+=this.parseMenu(item.children_data);
        }
    }

    return retVal+"</ul>";
  }

}

export default App;
