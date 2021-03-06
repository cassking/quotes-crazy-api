import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';
import QuoteBody from './QuoteBody';
import QuoteFooter from './QuoteFooter';
import QuoteNavigation from './QuoteNavigation';
// here we use anES6 class to define a component:
class QuotesDisplay extends React.Component {
  constructor() {
    super();
    this.state ={
      quote: {},
      triggerRedirect: false
    }
    this.fetchQuote = this.fetchQuote.bind(this);
    this.setQuoteIdFromQueryString = this.setQuoteIdFromQueryString.bind(this);

    //this.redirectToTarget = this.redirectToTarget.bind(this);
  }

// We are interested in the contents of the location object,
// as it gives us the query string part of the path
// (called search in React Router terms).
// So, if the user goes to http:
//our-website/?quotes=1, we will be ready to
// parse the ?quotes=1 part and fetch a quote
// with ID 1 from the database.
setQuoteIdFromQueryString(myquerystr){
  //console.log('querys', myquerystr)
  this.qsParams = queryString.parse(myquerystr)//uses query-string gem
  if (this.qsParams.quote) {
    //console.log('this.qsParams.quote',this.qsParams.quote)
    // assign quote ID from the URL's query string
    this.quoteId=Number(this.qsParams.quote)
  } else {
    //if query string not found default to 1
    this.quoteId = this.props.startingQuoteId
     // update URL in browser to reflect current quote in query string
     this.props.history.push(`/?quote=${this.quoteId}`)
     //React Router already parses the location
     //for you and passes it to your RouteComponent as props.
     //You can access the query (after ? in the url) part via
  }
}

fetchQuote(id){
  //below for next phase getting quotes directly from api
  const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Mashape-Key': 'x4KwcPRjkbmshOPgAiWYwr0B4f7vp1wrN5rjsnwMAckYt6AGC4'
 }
};
   //the corresponding quote from  database
   //then update state
   //fetch vs axios here
   //https://medium.com/@thejasonfile/fetch-vs-axios-js-for-making-http-requests-2b261cdd3af5
axios.get(`api/quotes/${id}`, config)
//axios.get(`https://andruxnet-random-famous-quotes.p.mashape.com/?cat=`, config)
  .then(response => {
    console.log('response', response.data)
    this.setState({quote: response.data});
  })
  .catch(error => {
    console.log(error)
    //in case of error, show first quote
    // this.redirectToTarget()
    this.setState({triggerRedirect: true})
  })
}
  // is invoked after receiving the props, and before rendering
  componentWillReceiveProps(nextProps){
    //clicking next need to rerender w diff props
    //user <link> to ensure shareable link for ea quote
    this.setQuoteIdFromQueryString(nextProps.location.search)
    this.fetchQuote(this.quoteId)
  }

componentDidMount(){
  //use query-string to parse the props.location.search
  //this.props.location.search
  // parse the query parameters  using an existing
  // package such as query-string.
  //console.log('props', this.props.location)
  // props we  get from router this.props.location are
  // hash:,key:,pathname:,search:,state:
  this.setQuoteIdFromQueryString(this.props.location.search)
  console.log('this.quoteId', this.quoteId)
  this.fetchQuote(this.quoteId)

}
// redirectToTarget = () => {
//   this.props.history.push(`/`)
// }

render () {
  const quote = this.state.quote
  const nextQuoteId = quote.next_id
  const previousQuoteId =quote.previous_id
  return(
    <div className='quote-container'>
      {this.state.triggerRedirect &&
      <Redirect to={'/'} />
    }
      {/* checkout the info on conditional rendering
      https://reactjs.org/docs/conditional-rendering.html
       */}
       {/* if previousQuoteId is true then show it */}
       {previousQuoteId &&
         <QuoteNavigation
           direction='previous'
           otherQuoteId={previousQuoteId}
         />
       }
      {/* // <Link className="next-quote link-previous"
      //   to={`/?quote=${previousQuoteId}`}>Previous Quote
      // </Link> */}

    <QuoteBody
      quote={this.state.quote} />
      {/* <h1>{this.state.quote.quote}</h1> */}
      {/* <h2>author:<br />{this.state.quote.author}</h2> */}
      {nextQuoteId &&
        <QuoteNavigation
          direction='next'
          otherQuoteId={nextQuoteId}
        />
      }
       {/* <Link className="next-quote link-next"
        to={`/?quote=${nextQuoteId}`}>Next Quote
       </Link> */}
      {this.state.quote.id !== parseInt(this.props.startingQuoteId,10) &&
      <QuoteFooter
        startingQuoteId={this.props.startingQuoteId}
      />
    }
    </div>
  )
}


}

export default QuotesDisplay;
