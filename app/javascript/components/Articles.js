import React from "react"

class Articles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wpm: 100,
      error: null,
      isLoaded: false,
      articles: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("api/articles")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            articles: result
          });
        },
        // 補足：コンポーネント内のバグによる例外を隠蔽しないためにも
        // catch()ブロックの代わりにここでエラーハンドリングすることが重要です
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  handleChange(event) {
    this.setState({wpm: Number(event.target.value)});
  }

  render() {
    const { error, isLoaded, articles } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <>
          <label>
            Your WPM:
            <select value={this.state.wpm} onChange={this.handleChange}>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="150">150</option>
              <option value="200">200</option>
            </select>
          </label>
          <table>
            <tr>
              <th>Source</th>
              <th>Title</th>
              <th>Japanese title</th>
              <th>Words</th>
              <th>Level</th>
            </tr>
            {articles.map(article => (
              <tr key={article.id}>
                <td>{article.source}</td>
                <td><a href={article.url}>{article.title}</a></td>
                <td>{article.japanese_title}</td>
                <td>{article.words}({Math.round(article.words / this.state.wpm * 10) / 10}mins)</td>
                <td>{article.level}</td>
              </tr>
            ))}
          </table>
        </>
      );
    }
  }
}

export default Articles
