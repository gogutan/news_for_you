import React from 'react'
import PropTypes from 'prop-types'
import GoogleLogo from 'images/greyscale-short.png'

const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))
const scores = range(300, 990, 5)
const wpms = range(30, 300, 5)

function Article (props) {
  Article.propTypes = {
    article: PropTypes.object,
    wpm: PropTypes.number
  }
  return (
    <>
      <td>{props.article.source}</td>
      <td><a href={props.article.url}>{props.article.title}</a></td>
      <td>{props.article.japanese_title}</td>
      <td>{props.article.words}</td>
      <td>{Math.round(props.article.words / props.wpm * 10) / 10} mins</td>
      <td>{props.article.level}</td>
    </>
  )
}

class Articles extends React.Component {
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
        // 補足：コンポーネント内のバグによる例外を隠蔽しないためにも
        // catch()ブロックの代わりにここでエラーハンドリングすることが重要です
        (error) => {
          this.setState({
            isLoaded: true,
            error
          })
        }
      )
  }

  renderArticle (article) {
    return <Article article={article} wpm={this.state.wpm} />
  }

  handleToeicChange (event) {
    this.setState({ toeic: Number(event.target.value) })
  }

  handleWpmChange (event) {
    this.setState({ wpm: Number(event.target.value) })
  }

  render () {
    const { error, isLoaded, articles } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <>
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
            <tbody>
              {articles.map(article => (
                <tr key={article.id}>
                  {this.renderArticle(article)}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )
    }
  }
}

export default Articles
