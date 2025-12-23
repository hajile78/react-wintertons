import { useState, useEffect, SetStateAction, Dispatch } from 'react'
import { Link, useParams } from 'react-router-dom'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { Quote } from './quoteForm/Quote'
import { api } from '../services/api'
import { Post } from '../types/Post'

interface PostQuote {
	quotes: Quote[]
	setQuote: Dispatch<SetStateAction<Quote>>
}

const postsPerPage: number = 3

function Posts({ quotes, setQuote }: PostQuote) {
	const [posts, setPosts] = useState<Post[]>([])
	const [totalPosts, setTotalPosts] = useState<Post[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	let { id, slug } = useParams()

	useEffect(() => {
		async function fetchPosts() {
			try {
				if (!slug && !id) {
					slug = 'Main'
				}

				const data: Post[] = slug
					? await api.getPosts(slug)
					: await api.getPost(id!)
				const postElem =
					slug === 'Main' ? data.sort(sortDataAsc) : data.sort(sortDataDesc)

				setPosts(postElem.slice(0, postsPerPage))
				setTotalPosts(postElem.slice(postsPerPage))
				setLoading(false)
			} catch (e) {
				setTotalPosts([])
				setPosts([])
				setLoading(false)
				console.error('Error fetching posts:', e)
			}

			function sortDataAsc(b: Post, a: Post): number {
				return new Date(b.created).getTime() - new Date(a.created).getTime()
			}
			function sortDataDesc(b: Post, a: Post): number {
				return new Date(a.created).getTime() - new Date(b.created).getTime()
			}
		}

		fetchPosts()
		if (quotes.length > 0) {
			setQuote(quotes[Math.floor(Math.random() * quotes.length)])
		}
	}, [slug, id, quotes, postsPerPage])

	const showUser = (user: string) => (user === 'Main' ? '' : `by ${user}`)
	const handelMoreClick = () => {
		const morePosts = totalPosts.filter((v: Post, i: number) => {
			return i < postsPerPage
		})
		setPosts([...posts, ...morePosts])
		setTotalPosts([...totalPosts.slice(postsPerPage)])
	}

	return (
		<div className='lg:col-span-2 space-y-10'>
			{posts.length > 0 ? (
				posts.map((post) => {
					return (
						<motion.div
							key={post.id}
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.1 }}
						>
							<Card className='rounded-2xl shadow-lg overflow-hidden bg-[#ddd]'>
								<CardContent className='p-6'>
									<h3 className='text-2xl font-bold mb-2'>
										<Link to={'/post/' + post.id}>{post.title}</Link>
									</h3>
									<p className='lead'>{showUser(post.user)}</p>
									{post.user !== 'Main' ? (
										<p className='mb-2'>
											<svg
												xmlns='www.w3.org'
												fill='none'
												viewBox='0 0 24 24'
												stroke-width='1.5'
												stroke='currentColor'
												className='w-6 h-6 inline-block mr-1'
											>
												<path
													stroke-linecap='round'
													stroke-linejoin='round'
													d='M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
												/>
											</svg>{' '}
											{new Date(post.created).toDateString()}{' '}
											{new Date(post.created).toLocaleTimeString()}
										</p>
									) : (
										''
									)}
									<p
										className='mb-4 mt-4'
										dangerouslySetInnerHTML={{ __html: post.body }}
									></p>
								</CardContent>
							</Card>
						</motion.div>
					)
				})
			) : (
				<>
					{loading ? (
						<div className='loader'>Loading...</div>
					) : (
						<Card className='rounded-2xl shadow-lg overflow-hidden bg-[#ddd]'>
							<CardContent className='p-6'>
								<h3>No Content Here ☹️</h3>
							</CardContent>
						</Card>
					)}
				</>
			)}

			{totalPosts && totalPosts.length > 0 ? (
				<Button
					className='btnSubmitPost bg-blue-600 hover:bg-blue-700 text-white'
					onClick={handelMoreClick}
				>
					More
				</Button>
			) : (
				''
			)}
		</div>
	)
}

export default Posts
