from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def _to_corpus(skill_list):
    # join skills into a single document string
    return " ".join(skill_list)


class MLCore:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()

    def compute_similarity(self, syllabus_skills, job_skill_sets):
        """
        Enhanced similarity computation with per-skill similarity and confidence.
        final_skill_score = 0.6 * similarity_score + 0.4 * exposure_score
        exposure_score is 1.0 if present in syllabus_skills else 0.0
        Returns a list of per-job result dicts including per_skill_confidence.
        """
        try:
            syllabus_doc = _to_corpus(syllabus_skills)
            # If syllabus is empty, avoid vectorizer errors
            if not syllabus_doc.strip():
                 syllabus_doc = "general"

            results = []
            for job in job_skill_sets:
                try:
                    # build per-job vectorization to get per-skill similarity to syllabus
                    skills = job.get('skills', [])
                    if not skills:
                        continue

                    corpus = [syllabus_doc] + skills
                    # Min_df=1 ensures we don't drop terms if they appear once
                    tfidf = TfidfVectorizer(min_df=1).fit_transform(corpus)
                    
                    # If we don't have enough rows (vocab empty or other issue), skip
                    if tfidf.shape[0] < 2:
                         continue

                    # syllabus vector is index 0; skills are 1..n
                    sim_vecs = cosine_similarity(tfidf[0:1], tfidf[1:]).flatten()

                    per_skill_similarity = {s: float(sim) for s, sim in zip(skills, sim_vecs)}

                    per_skill_confidence = {}
                    total_weight = sum(job.get('weights', {}).values()) if job.get('weights') else len(skills) or 1
                    match_weight = 0.0

                    for s in skills:
                        similarity_score = per_skill_similarity.get(s, 0.0)
                        exposure_score = 1.0 if s in syllabus_skills else 0.0
                        final_score = 0.6 * similarity_score + 0.4 * exposure_score

                        # label
                        if final_score >= 0.75:
                            label = 'Strong'
                        elif final_score >= 0.45:
                            label = 'Medium'
                        else:
                            label = 'Weak'

                        per_skill_confidence[s] = {
                            'similarity_score': similarity_score,
                            'exposure_score': exposure_score,
                            'final_score': final_score,
                            'label': label
                        }

                        w = job.get('weights', {}).get(s, 1.0)
                        match_weight += final_score * w

                    readiness = (match_weight / total_weight) * 100.0

                    missing = [s for s, v in per_skill_confidence.items() if v['final_score'] < 0.5]
                    weak = [s for s, v in per_skill_confidence.items() if 0.45 <= v['final_score'] < 0.75]

                    # overall document similarity: syllabus vs job skills doc
                    job_doc = _to_corpus(skills)
                    overall_sim = 0.0
                    try:
                        ov_tfidf = TfidfVectorizer(min_df=1).fit_transform([syllabus_doc, job_doc])
                        if ov_tfidf.shape[0] >= 2:
                            overall_sim = float(cosine_similarity(ov_tfidf[0:1], ov_tfidf[1:]).flatten()[0])
                    except Exception:
                         overall_sim = 0.0

                    results.append({
                        'role': job.get('role'),
                        'similarity': overall_sim,
                        'readiness_pct': readiness,
                        'missing_skills': missing,
                        'weak_skills': weak,
                        'per_skill_scores': {s: per_skill_confidence[s]['final_score'] for s in per_skill_confidence},
                        'per_skill_confidence': per_skill_confidence
                    })
                except Exception as inner_e:
                    print(f"Error processing job {job.get('role')}: {inner_e}")
                    continue

            return results
        except Exception as e:
            print(f"ML Core Error: {e}")
            return []
