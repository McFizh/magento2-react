import React, { Component } from 'react';
import './css/App.css';

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

    xhr.open("GET","http://localhost:3080/api/categories");

    xhr.onreadystatechange = function() { objRef.ajaxCallback(xhr); }
    xhr.send();
  }

  ajaxCallback(xhr) {
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        var data = JSON.parse( xhr.responseText );

	// We use data[0].childs, because we don't want to show root
	// category in menu
        this.setState(
            { menuData: this.parseMenu( data[0].childs ) }
        );
    }
  }

  parseMenu(menuData) {
    var retVal = "<ul>";

    for(let item of menuData) {
        retVal += "<li>"+item.name;
        if (item.childs && item.childs.length > 0) {
            retVal+=this.parseMenu(item.childs);
        }
	retVal += "</li>";
    }

    return retVal+"</ul>";
  }

}

export default App;
