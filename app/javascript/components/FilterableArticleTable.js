import React from 'react'
import PropTypes from 'prop-types'
import GoogleLogo from 'images/greyscale-short.png'

const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))
const scores = range(300, 990, 5)
const wpms = range(30, 300, 5)

class ArticleRow extends React.Component {
  render () {
    const article = this.props.article
    const wpm = this.props.wpm
    return (
      <tr>
        <td>{article.source}</td>
        <td><a href={article.url}>{article.title}</a></td>
        <td>{article.japanese_title}</td>
        <td>{article.words}</td>
        <td>{Math.round(article.words / wpm * 10) / 10} mins</td>
        <td>{article.level}</td>
      </tr>
    )
  }
}

class ArticleTable extends React.Component {
  render () {
    const rows = []
    this.props.articles.forEach((article) => {
      rows.push(
        <ArticleRow
          article={article}
          key={article.title}
          wpm={this.props.wpm}
        />
      )
    })
    return (
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Title</th>
            <th>Japanese Title <img src={GoogleLogo}></img></th>
            <th>Words</th>
            <th>Time</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}

class FilterableArticleTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      toeic: 600,
      wpm: 100,
      error: null,
      isLoaded: false,
      articles: []
    }
    this.handleToeicChange = this.handleToeicChange.bind(this)
    this.handleWpmChange = this.handleWpmChange.bind(this)
  }

  componentDidMount () {
    fetch('api/articles')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            articles: result
          })
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          })
        }
      )
  }

  handleToeicChange (event) {
    this.setState({ toeic: Number(event.target.value) })
  }

  handleWpmChange (event) {
    this.setState({ wpm: Number(event.target.value) })
  }

  render () {
    const { error, isLoaded } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <div>
          <label>
            Your TOEIC:
            <select value={this.state.toeic} onChange={this.handleToeicChange}>
              { scores.map(s => <option key={s.toString()} value={s.toString()}>{s}</option>) }
            </select>
          </label>
          <label>
            Your WPM:
            <select value={this.state.wpm} onChange={this.handleWpmChange}>
            { wpms.map(w => <option key={w.toString()} value={w.toString()}>{w}</option>) }
            </select>
          </label>
          <ArticleTable
            articles={this.state.articles}
            wpm={this.state.wpm}
          />
        </div>
      )
    }
  }
}

ArticleRow.propTypes = {
  article: PropTypes.shape({
    source: PropTypes.string,
    url: PropTypes.string,
    title: PropTypes.string,
    japanese_title: PropTypes.string,
    words: PropTypes.number,
    level: PropTypes.number
  }),
  wpm: PropTypes.number
}

ArticleTable.propTypes = {
  articles: PropTypes.array,
  wpm: PropTypes.number
}

export default FilterableArticleTable
