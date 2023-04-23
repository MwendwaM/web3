import Head from 'next/head'
import { useState, useEffect } from 'react'
import Web3 from 'web3'
import VendingMachineContract from '@/blockchain/vending'
import 'bulma/css/bulma.css'
import styles from '../styles/VendingMachine.module.css'
//import { SocketAddress } from 'net'


const VendingMachine = () => {
    const [ error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [inventory, setInventory] = useState('')
    const [nftcount, setMyNftCount] = useState('')
    const [buyCount, setBuyCount] = useState('')
    const [web3, setWeb3 ] = useState(null)
    const [address, setAddress] = useState(null)
    const [VmContract, setVmContract] = useState(null)
    const [purchases, setPurchases] = useState(0)


    useEffect(() => {
        if( VmContract) getInventoryHandler()
        if(VmContract && address)getMyNftCount()
    },[VmContract, address,purchases] ) 

    const getInventoryHandler = async () => {
        const inventory = await VmContract.methods.getVendingMachineBalance().call()
        setInventory(inventory)
    }
//window.ethereum

    const getMyNftCount = async () => {
        const count = await VmContract.methods.donutBalances(address).call()
        setMyNftCount(count)
    }

    const updateNftQty = event => {
        setBuyCount(event.target.value)
    }
 
    const purchaseHandler = async () => {
        try{
            await VmContract.methods.purchase(buyCount).send({
                from: address,
                value: web3.utils.toWei('0.000001', 'ether') * buyCount           
            })
            setPurchases(prevState => prevState + 1)
            setSuccessMsg(`you have purchased ${buyCount} NFTS `)
        } catch (err){
            setError(err.message)
        }
    }

    const connectWalletHandler = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
            try {
                await window.ethereum.request({method: "eth_requestAccounts"})
                const web3Instance = new Web3(window.ethereum)
                setWeb3(web3Instance)
                const accounts = await web3Instance.eth.getAccounts()
                setAddress(accounts[0])
                const vm = VendingMachineContract(web3Instance)
                setVmContract(vm)
            }
            catch(err){
                setError(err.message)
            }
            
    } else{
        //wallet not installed
        console.log("please install wallet")
    }
    }
        return(
            <div className={styles.main}>
                <Head>
                    <title>Vending machine app</title>
                    <meta name="description" content="blockcahin vending machine" />
                </Head>

                <nav className='navbar mt-4 mb-4'>
                    <div className='container'>
                        <div className='navbar-brand'>
                            <h1>  Your NFT market</h1>
                        </div>
                        <div className='navbar-end'>
                            <button onClick={connectWalletHandler} className='button is-primary'>connect wallet</button>
                        </div>
                    </div>
                </nav>

                <section>
                    <div className='container'>
                        <h2>NFT inventory:  <b>{inventory}</b> </h2>
                    </div>
                </section>

                <section>
                    <div className='container'>
                        <h2>My NFTS:  <b>{nftcount}</b> </h2>
                    </div>
                </section>

                <section className='mt-5'>
                    <div className='container'>
                        <div className='field'>
                            <label className='label'> Buy NFTS</label>
                            <div className='control'>
                                <input onChange= {updateNftQty} className='input' type='type' placeholder='how many... '/>
                            </div>
                            <button onClick={purchaseHandler} className='button is-primary mt-4'> Buy </button>
                        </div>
                    </div>
                </section>

                <section>
                    <div className='container has-text-danger'>
                        <p> <b> {error} </b></p>
                    </div>
                </section>

                <section>
                    <div className='container has-text-susccess'>
                        <p><b> { successMsg} </b></p>
                    </div>
                </section>

            </div>
            
        )
    }
export default VendingMachine