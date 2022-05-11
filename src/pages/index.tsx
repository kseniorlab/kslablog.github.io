import React, { FunctionComponent, useMemo } from 'react'
import CategoryList, {CategoryListProps} from 'components/Main/CategoryList'
import TopSection from "components/Main/TopSection";
import Footer from "components/Footer";
import PostList from 'components/Main/PostList'
import { PostListItemType } from 'types/PostItem.types'
import "../App.css"
import { graphql } from 'gatsby'
import queryString, { ParsedQuery } from 'query-string'

type IndexPageProps = {
    location: {
        search: string
    }
    data: {
        allMarkdownRemark: {
            edges: PostListItemType[]
        }
    }
}

const IndexPage: FunctionComponent<IndexPageProps> = function ({
   location: { search },
   data: {
       allMarkdownRemark: { edges },
   },
}) {
    const parsed: ParsedQuery<string> = queryString.parse(search)
    const selectedCategory: string =
        typeof parsed.category !== 'string' || !parsed.category
            ? 'All'
            : parsed.category

    const categoryList = useMemo(
        () =>
            edges.reduce(
                (
                    list: CategoryListProps['categoryList'],
                    {
                        node: {
                            frontmatter: { categories },
                        },
                    }: PostListItemType,
                ) => {
                    categories.forEach(category => {
                        if (list[category] === undefined) list[category] = 1;
                        else list[category]++;
                    });

                    list['All']++;

                    return list;
                },
                { All: 0 },
            ),
        [],
    )

    return (
        <>
            <TopSection/>
                <div>
                    <CategoryList selectedCategory={selectedCategory} categoryList={categoryList} />
                    <div className="list">
                        <PostList selectedCategory={selectedCategory} posts={edges}/>
                    </div>
                </div>
            <Footer/>
        </>
    )
}

export default IndexPage

export const getPostList = graphql`
  query getPostList {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }
    ) {
      edges {
        node {
          id
           fields {
            slug
          }
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 768, height: 400)
              }
            }
          }
        }
      }
    }
  }
`