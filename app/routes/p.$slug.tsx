import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { SinglePageView } from '~/components/site/single-page-content'

export default function PSlugRoute() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (slug) {
      navigate(`/${slug}`, { replace: true })
    }
  }, [slug, navigate])

  return <SinglePageView slug={slug} />
}
