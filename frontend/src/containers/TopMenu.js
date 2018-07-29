import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchCategoryData } from '../actions/index';

class TopMenu extends Component {

    componentDidMount() {
        this.props.fetchCategoryData();
    }

    renderMenu(catData) {
        // Render nothing, if catdata is empty
        if(catData.length===0) {
            return;
        }

        // Skip category first level
        if(catData[0].level === 1) {
            return this.renderMenu(catData[0].childs);
        }

        //
        return ( <ul> {
            catData.map(cat => {
                return (
                    <li key={cat.id}>{cat.name}
                    {this.renderMenu(cat.childs)}
                    </li>
                );
            })
        } </ul> );
    }

    render() {
        return (
            <div className='menu'>
            {this.renderMenu(this.props.categories)}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        categories: state.categories
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        fetchCategoryData: fetchCategoryData
    }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(TopMenu);
