---
layout: post
title:  "The Biggest Enemy of Generative Modeling"
date:   2025-04-17 18:19:56 +0530
categories: Generative-Modeling
timetoread: 18
---
“Ever heard your grandma talk about generative models?” — WHAT A STUPID QUESTION, RIGHT? Well, as it turns out, **it is not a stupid question**. The idea of generative models can be dated as far back as 1763 when **Thomas Bayes gave the world the “Bayesian Inference”**. However, this explanation only works for those of you who look at generative modeling as a task in Bayesian statistics. For the frequentist approach, the earliest work in generative modeling can be traced back approximately to the 1920s when **Ronald Fisher connected Maximum Likelihood Estimation (MLE) to statistical modeling**. Here, we take both views into account and understand how today’s scientists have successfully evaded the evils of approximating an underlying distribution. Before going ahead, let us finalize some notations for the entire article.

$$
\{x^{n}\}_{n=1}^{N} - \text{Observed data samples}
$$
$$
p_\theta(x) - \text{Arbitrary model family parameterized by }\theta
$$
$$
q_{data}(x) - \text{"True but unknown" data distribution}
$$
$$
p(z|x) - \text{Conditional probabiltiy distribution of z given x}
$$

## But What Is This "Evil"?

In the axioms of probability, the probability distributions must sum up to 1 in order to be valid.

$$
\int{p(x)}dx = 1
$$

The problem of generative modeling, in its most abstract form, is simply a problem of approximating a probability distribution to the true data distribution.

$$
p_\theta(x) \approx q_{data}(x)
$$

However, the probability distribution in question is usually approximated using neural networks (which try to fit flexible functions into the existing data). **These functions are always learned in their unnormalized forms unless defined explicitly (like the `softmax` layer in the transformer paper).** This is where the problem arises — ***to sample from a probability distribution, we need it to be normalized.*** Why?

Sampling essentially means picking out data points from a distribution with the following constraint on the amount of data that can lie in a particular area (A),

$$
p(x\in A) = \int_{A}{p(x)}dx
$$

But when the distribution is unnormalized, sampling takes the following form,

$$
p(x\in A) = \frac{\int_{A}{f(x)}dxA}{\int{f(x)}dx}
$$

where $f(x)$ is the function represented by the neural network (unnormalized function).

This introduces a **normalization constant** in our equation that is computationally intractable when we have functions that have millions of parameters, since you can not compute it in its closed form. Therefore, **the “evil” here is this intractable integral without which we fail to sample new data points from our underlying distribution.**

Now that we have understood the evil at hand, we will look at all the major classes of generative models and see how exactly they evaded this evil.

## Variational Autoencoders (VAEs)

Problem at hand — **“How can we perform efficient approximate inference and learning with directed probabilistic models whose continuous latent variables and/or parameters have intractable posterior distributions?”** (p.s. this is the first line of the <a href="https://arxiv.org/pdf/1312.6114">VAE paper</a>)

<p>
    <center>
        <img src="{{ site.baseurl }}/assets/vae.png">
        <em>A very basic illustration of an autoencoder (Image taken from this
 <a href="https://hlfshell.ai/posts/representation-engineering/">Kaggle notebook</a>)</em>
    </center>
</p>

The autoencoder model circles around the existence of latent variables — variables that define the inputs but are not directly observed.

$$
p(x, z) = p(z).p(x|z)
$$

Therefore, our goal becomes to model the following marginal likelihood,

$$
p(x) = \int{p(z)p(x|z)dz}
$$

The prior `p(z)` is designed to be tractable (usually a multivariate standard normal distribution). However, this marginal becomes intractable due to the following reasons:

- `p(x|z)` is non-linear (since it is a neural network — decoder).
- `z` usually has a very high dimension.
- there is no closed-form solution to the integral.

**Note — Before coming to `p(x|z)` i.e., the decoder, we have to talk about `p(z|x)`, i.e., the encoder, which faces the same problem of intractability.**

Continuing with our task of avoiding the integral, we use the oldest trick in the book and introduce a variational distribution (i.e., the encoder),

$$
p(x) = \int{\frac{p(x, z)}{q(z|x)}.q(z|x)}
$$

Let us recollect what we know about KL-Divergence,

$$
D_{KL}[q(z|x)||p(z|x)] = \mathbb{E}_{q(z|x)}\[\log{\frac{q(z|x)}{p(z|x)}}\]
$$

Using Bayes’ Rule,

$$
p(z|x) = \frac{p(x, z)}{p(x)}
$$

The earlier equation becomes,

$$
D_{KL}[q(z|x)||p(z|x)] = \mathbb{E}_{q(z|x)}[\log{\frac{q(z|x)}{p(x, z)}} + \log{p(x)}]
$$

Since $p(x)$ is a constant w.r.t $z$, we get,

$$
\log{p(x)} = D_{KL}[q(z|x)||p(z|x)] + \mathbb{E}_{q(z|x)}[\log{\frac{p(x, z)}{q(z|x)}}]
$$

**The expectation part is what we call the lower bound on the marginal likelihood of the observed data.**

Okay, perfect! Now, since KL Divergence is always non-negative, we can drop that from the above equation to formulate the following inequality:

$$
\log{p(x)} \geq \mathbb{E}_{q(z|x)}[\log{p(x|z)}] - D_{KL}[q(z|x)||p(z)]
$$

```The RHS here is known as the Evidence Lower Bound (ELBO). The main objective of a VAE is to maximize ELBO (which doesn’t require any knowledge about p(x) and the KL Divergence is often analytically calculated as the prior distribution is chosen to be a standard normal distribution).```

Furthermore, the <a href="https://gregorygundersen.com/blog/2018/04/29/reparameterization/">reparameterization trick</a> is used to optimize the parameters by using the standard gradient methods.

Therefore, **by maximizing ELBO and using the reparameterization trick, VAEs dodge the “evil” of the intractable integral and are able to learn from the data and later provide inference on it.**

### Generative Adversarial Networks (GANs)

Unlike VAEs, **GANs avoid the intractable integral by removing the need for probability densities altogether.**

<p>
    <center>
        <img src="{{ site.baseurl }}/assets/gan.png">
        <em>An overview of the architecture of GAN architecture (Image taken from
 <a href="https://aws.amazon.com/what-is/gan/">this link</a>)</em>
    </center>
</p>

Here's a quick intro about how a GAN learns,

```
The generator (`G`) takes in a random noise vector (`z`) and tries to mimic the real distribution by mapping the noise vector to a data space, `x=G(z)`. Then, the discriminator (`D`) takes in that output and generates a probability score indicating whether or not the input came from the real dataset. Both, the generator and the discriminator keep trying to outsmart eachother and as a result, learn the data distribution IMPLICITLY.
```

Now, let us look into how this happens mathematically. For those of you familiar with game theory, the learning process of a GAN is simply a two-player zero-sum game. Simply put, this means that the game is devised in such a way that one player’s profit is directly proportional to the other player’s loss.

$$
\min_{G}\max_{D}V(D, G) = \mathbb{E}_{x\sim q_{data}}[\log{D(x)}] + \mathbb{E}_{z\sim p(z)}[\log{(1 - D(G(z)))}]
$$
<center>`V(D, G)` is the payoff function for the game</center>

So, here `V` is trying to maximize the payoff function to identify more samples correctly and `G` is trying to minimize the payoff function to fool the discriminator.

Okay, now you can ask, “Cool! But how long does it keep playing the game?”. Well, there is a concept in game theory called **“Nash Equilibrium,”** which is basically a state in which neither player can improve its payoff without the other player changing its state (parameters, in our case). This is the “ideal” state for a GAN to be in at the end of its training. When a GAN is in equilibrium, the following two conditions are true,

1 — The generator (`G`) samples from the real distribution of the data.

2 — The discriminator (`D`) is unable to distinguish the fake samples from the real ones, i.e.,

$$
D(G(z)) = \frac{1}{2} \forall z \sim p(z) = q_{data}(x)
$$

However, in practice, this type of convergence is seldom seen due to,

- Non-convexity of the optimization plane
- Optimization instability

Therefore, we see that Ian Goodfellow created GANs as a completely new set of generative models that approximate the densities in an **implicit fashion**. Although vanilla GANs had training issues, the variants also follow the same underlying structure that we talked about, except for some changes to the loss function.

*Note -> GANs are strictly non-Bayesian in nature.*

## Energy-Based Models (EBMs)

An energy-based model defines the probability of a data point `x` using an unnormalized density:

$$
p_{\theta}(x) = \frac{e^{-E_{\theta}(x)}}{Z_{\theta}}, Z_{\theta} = \int{e^{-E_{\theta}(x')}dx}
$$
<center>This is basically the same thing that we discussed in our <a href="https://cdn-images-1.medium.com/max/1200/1*iaKkSePZBELWUYBqFLZbwQ.png">problem introduction</a></center>

This clearly translates to the “evil” that we are trying to evade, i.e., `Z(\theta)` — the normalization constant is an intractable integral.

The only difference here is that we have an “energy function” — `E(\theta)` ; **but why is that?** Anyone who has studied a semester of statistical physics would instantly recognize the above equation as a **special case of the Boltzmann distribution (with `kT = 1`) — a distribution in thermodynamics that describes the probability of a system being in the state `x`.**

```
The whole idea is to look at a system as an energy landscape with the energy at any particular state defining the probability of the system to be present in that state. Higher the energy of a state, lower the probability of the system to be in that state.
```

<p>
    <center>
        <img src="{{ site.baseurl }}/assets/ebm.gif">
        <em>Model learning the low energy regions (Animation taken from 
 <a href="https://mpmisko.github.io/2024/ai-fundamentals-energy-based-models/">Michal’s corner</a>)</em>
    </center>
</p>

This works well with our understanding of the optimization plane — reach the minima if you want to learn the patterns in the training data. Here, the valleys correspond to the training data, and the hills correspond to irrelevant regions.

Got it! **But how do EBMs evade the curse of the normalization factor?**

Over the years, different approaches have been developed to train EBMs without having to deal with the intractable integral. Here, we will only discuss one approach in depth.

### Score Matching

The idea is to eliminate the intractable integral by calculating the gradient of the log likelihood with respect to `x` **(remember, in MLE, this gradient would have been w.r.t the parameters — `\theta`)**

<p>
    <center>
        <img src="{{ site.baseurl }}/assets/score_matching.jpeg">
        <em>This gradient of the log likelihood is also known as the **score function**</em>
    </center>
</p>

Score matching then optimizes the **Fisher Divergence** to minimize the difference between the model distribution and the true distribution,

