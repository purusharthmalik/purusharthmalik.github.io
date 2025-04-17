---
layout: post
title:  "The Biggest Enemy of Generative Modeling"
date:   2025-04-17 18:19:56 +0530
categories: Generative-Modeling
timetoread: 18
---
“Ever heard your grandma talk about generative models?” — WHAT A STUPID QUESTION, RIGHT? Well, as it turns out, **it is not a stupid question**. The idea of generative models can be dated as far back as 1763 when **Thomas Bayes gave the world the “Bayesian Inference”**. However, this explanation only works for those of you who look at generative modeling as a task in Bayesian statistics. For the frequentist approach, the earliest work in generative modeling can be traced back approximately to the 1920s when **Ronald Fisher connected Maximum Likelihood Estimation (MLE) to statistical modeling**. Here, we take both views into account and understand how today’s scientists have successfully evaded the evils of approximating an underlying distribution. Before going ahead, let us finalize some notations for the entire article.

$$
\{x^{n}\}_{n=1}^{N}$ - \text{Observed data samples}
\\\\
p_\theta(x)$ - \text{Arbitrary model family parameterized by }\theta
\\\\
q_{data}(x) - \text{"True but unknown" data distribution}
\\\\
p(z|x) - \text{Conditional probabiltiy distribution of z given x}
$$