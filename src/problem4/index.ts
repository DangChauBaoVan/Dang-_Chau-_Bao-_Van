func sum_to_n_a(n: number): number {
	let sum = 0
	for(let i = 1; i < = n; i++){
		sum += i
	}
	return sum
}

func sum_to_n_b(n: number): number {
	if(n === 1) return 1
	return n + sum_to_n_b(n-1)
}

func sum_to_n_c(n: number): number {
	return (n*(n+1))/2
}